#### Définition des flags

Dans l'exploit https://github.com/m8sec/CVE-2021-34527/blob/main/CVE-2021-34527.py ligne 307, les flags sont définis :
```python
 flags = rprn.APD_COPY_ALL_FILES | 0x10 | 0x8000 # Définition du flag
```

Lors de sa définition, `flags` prend 3 valeurs dans une suite de OU logique '`|`', voyons en détail ce que cette opération produit :

| Opération | Valeur (Bin)        | Valeur (Hex) | Nom                       |
| --------- | ------------------- | ------------ | ------------------------- |
|           | 0000 0000 0000 0100 | 0x00000004   | APD_COPY_ALL_FILES        |
| OR        | 0000 0000 0001 0000 | 0x00000010   | APD_COPY_FROM_DIRECTORY   |
| OR        | 1000 0000 0000 0000 | 0x00008000   | APD_INSTALL_WARNED_DRIVER |
| RESULTAT  | 1000 0000 0001 0100 | 0x800014     | flags (=dwFileCopyFlags)  |

Voila le résultat de l'opération dans une console Python :
```python
>> test = 0x10 | 0x8000 | 0x4
>> print(test) 
32788
>> bin(test)
'0b1000000000010100'
```

On aura donc la valeur suivante dans la variable `flags` :

| Bit    | <font color="#ff0000">15</font> | 14  | 13  | 12  | 11  | 10  | 19  | 8   | 7   | 6   | 5   | 4                              | 3   | 2                              | 1   | 0   |
| ------ | ------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------------------------ | --- | ------------------------------ | --- | --- |
| Valeur | <font color="#ff0000">1</font>  | 0   | 0   | 0   | 0   | 0   | 0   | 0   | 0   | 0   | 0   | <font color="#ff0000">1</font> | 0   | <font color="#ff0000">1</font> | 0   | 0   |
Comme représenté sur le schéma suivant :
![[Pasted image 20241212155631.png]]
#### Appel de la commande d'ajout d'un pilote
Après avoir définit cette variable, l'attaquant va lancer la commande dont le module de vérification des privilèges est vulnérable.

```python 
resp = par.hRpcAsyncAddPrinterDriver(dce, pName=handle, pDriverContainer=container_info,
										 dwFileCopyFlags=flags) # Utilisation de la commande avec le flag défini
```
Il spécifie en paramètre les flags qui viennent d'être définis. Nous allons voir à présent comment cette commande va être interprété par le système.
Voici la portion de code intéressante de la fonction `AddPrinterDriverEx` :
```C
int fCheckPriv = 0;
if (!_bittest((const int *)&dwFileCopyFlags, 0xFu)) {  
    fCheckPriv = a7;              
}

if (fCheckPriv && !(unsigned int)ValidateObjectAccess(0x164, 0x1164, 0x164)) {     //Vérification des privilèges user
    return 0x164;  //Retourne une Erreur
}
return InternalAddPrinterDriverEx(...,dwFileCopyFlags)  //Le Pilote est ajouté avec les flags
```

C'est dans cette portion que ce fait la vérification des privilèges de l'utilisateur ayant appelé la commande. 
Imaginons le scénario suivant : Un administrateur se connecte au spooler d'un serveur de son Domain. Il souhaite ajouter les pilotes d'imprimantes de nouvelles imprimantes qui vont arriver dans son réseau. Il n'y a pas de problème, cette utilisation n'est pas abusive. Pourtant nous allons voir que la vérification de privilège qui se fait dans cette fonction permet de réaliser une élévation de privilège.

Au début du code, `fCheckPriv` est initialisé à 0 : 
```C
int fCheckPriv = 0;
```

Ensuite on va attribuer une valeur à `fCheckPriv` en regardant les flags qui ont été déclarés lors de l'appel de la fonction `AddPrinterDriverEx` :
```C
if (!_bittest((const int *)&dwFileCopyFlags, 0xFu)) {  // 0xFu = 15ème bit
    fCheckPriv = a7;              // Attribue une valeur à fCheckPriv
}
```
`_bittest` est une fonction qui prend en paramètre une adresse et une position pour retourner le bit de l'adresse à la position spécifiée. 
Dans notre cas on a : 
- Adresse : `&dwFileCopyFlags`
- Position : `0xFu` en hexadecimal soit `15` en décimal

Comme l'utilisateur peut modifier `dwFileCopyFlags`, il peut s'assurer que le bit 15 est définit. C'est ce que nous avons vu dans le point précédent.
Lors de la comparaison, `bittest`, va checker le bit 15 (0xF) de `flags` qui vaut <font color="#ff0000">1</font>.

Le programme ne va donc pas rentrer dans la condition `if`. Ainsi la valeur de `fCheckPriv` va rester à 0 (nul).

Et la condition `if` d'après qui appelle `ValidateObjectAccess` ne va pas s'exécuter et la fonction `InternalAddPrinterDriverEx()` va bien être lancée.

Lors de la comparaison, `bittest`, va checker le bit 15 (0xF) de `flags` qui vaut <font color="#ff0000">1</font>. (flags = <font color="#ff0000">1</font>000 0000 0001 0100)
```C
if (!_bittest((const int *)&dwFileCopyFlags, 0xFu))
```
Nb : L'opération `if (!bittest)` est l'équivalent de `if(bittest == 0)`.
On ne rentre pas dans la condition car `bittest` retourne 1.
On passe donc directement à l'appel de la fonction `InternalAddPrinterDriverEx()` :
```C
return InternalAddPrinterDriverEx(...,dwFileCopyFlags)  //Le Pilote distant est ajouté avec les flags
```
Dans un comportement normal, on aurait du entrer dans la condition qui suit. En effet, si `fCheckPriv` est définie, on rentre dans la condition suivante :
```C
if (fCheckPriv && !(unsigned int)ValidateObjectAccess(0x164, 0x1164, 0x164)) { //Vérification des privilèges user
    return 0x164;  //Retourne une Erreur
}
```
`ValidateObjectAccess` permet de vérifier les privilèges de l'utilisateur. 
Si `fCheckPriv` est activé et que l'accès n'est pas validé par `ValidateObjectAccess`,  alors l'exécution échoue et `return InternalAddPrinterDriverEx()` n'est pas exécuté.

La vulnérabilité réside donc dans la possibilité de contourner la vérification des privilèges nécessaires à l’appel de la fonction `AddPrinterDriverEx` via un flag spécifique dans `dwFileCopyFlags`.

### Liens
Article Français | https://cyberwatch.fr/actualite/cve-2021-34527-comment-identifier-et-neutraliser-la-vulnerabilite-printnightmare/
Article Coréen | https://m.blog.naver.com/adtkorea77/222480798358
Code Exploit | https://github.com/m8sec/CVE-2021-34527/blob/main/CVE-2021-34527.py
Documentation RpcAddPrinterDriverEx et ses Flags | https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-rprn/b96cc497-59e5-4510-ab04-5484993b259b
