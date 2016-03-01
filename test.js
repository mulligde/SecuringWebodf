
function encrypt(){
    //set up variables	
    var key = ["0ac1","0ac1","0ac1","0ac1"]; 
    
    var prp = new sjcl.cipher.aes(key), 
    text = document.getElementById( "Plain Before").innerHTML,
    encrypted =  document.getElementById("Encrypted")
  
    var rawCrypto, counter = [0,0,0,0];
    //encrypt each characte, put to encrypted
    for(i = 0; i < text.length; i++) {
	cryptoText = "";
	rawCrypto = encryptChar(text.charAt(i), prp, counter);	
	cryptoText = sjcl.codec.base64.fromBits(rawCrypto);
	encrypted.innerHTML += "@<b>".concat(i, "</b>","\n*");
	encrypted.innerHTML += cryptoText;
	counter[3]++;
	console.log( counter[3]);
    }
    //Delimiter ti prevent infinite loop in decryption
    encrypted.innerHTML += "@";
}


function decryptA(){

    encrypted =  document.getElementById("Encrypted").innerHTML;
    decrypt(encrypted);

}
function decryptMixed(copy){

    encrypted =  document.getElementById("Mixed").innerHTML;
    decrypt(encrypted);

}
function decrypt(copy){

    var key = ["0ac1","0ac1","0ac1","0ac1"]; 
    
    var prp = new sjcl.cipher.aes(key); 
    var out =   document.getElementById("Plain After"),
        text = document.getElementById( "Plain Before").innerHTML,
	inChar = "", 
	outChar = "", 
	outStr = "", 
	n = 0,
	counter = [0,0,0,0],
	numberStr = "",
	number,
	toBeDecrypted = "", 
	toBeDecryptedC = "";
    for(i = 0; i < text.length; i++) {
    //cycle through delimiters extract number
	while(inChar != "*") {

		inChar = copy.charAt(n);
		test = inChar;
		if(!isNaN(test)){
			numberStr = numberStr.concat(inChar);
		}
		n++;}
	
	counter[3]  = parseInt(numberStr);
	numberStr = "";
	inChar = "";
	toBeDecrypted = "";
	//Place base64 stream in buffer
	while(inChar != "@") {
		toBeDecrypted = toBeDecrypted.concat(inChar);
		inChar =copy.charAt(n);
		n++;
	}
        toBeDecryptedC = sjcl.codec.base64.toBits(toBeDecrypted);
	outChar = decryptChar(toBeDecryptedC, prp,counter);
	outStr = outStr.concat(sjcl.codec.utf8String.fromBits(outChar));
	inChar = "";
	//counter[3]++;
    }
    out.innerHTML = outStr;
}

function obfuscateEncrypted(){
	var mixed = document.getElementById("Mixed");
	mixed.innerHTML = obfuscate(document.getElementById("Encrypted").innerHTML);
}
	
function obfuscate(textBlock) {
	n = 1;
	for(i = 0; i < 10; i++) {
		while( textBlock.charAt(n) != "@") {
			n++;
		}
	console.log(n);
	n++
	}
	var newBlock  = textBlock.substr(n, textBlock.length - 1);
	newBlock = newBlock.concat(textBlock.substr(0,n));
	return newBlock;
}
	






function encryptChar(doChar, AesKey, ctr) {
        iv = "00000000000000000000000000000000",
        adata = "Adata",
        cipherText="",
        word = sjcl.codec.utf8String.toBits(doChar);
        cipherText = sjcl.mode.gcm.encrypt(AesKey, word, iv, adata, 128, ctr);
        //console.log(i, cipherText)
         return cipherText;
    }

function decryptChar(encryptedChar, AesKey, ctr) {
        iv = "00000000000000000000000000000000",
        adata = "Adata",
        plainText = sjcl.mode.gcm.decrypt(AesKey, encryptedChar, iv, adata, 128, ctr);
	return plainText;
    }

