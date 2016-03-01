
function DEPRECATED_iencrypt(){
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


function dDEPRECATED_iecryptA(){

    encrypted =  document.getElementById("Encrypted").innerHTML;
    decrypt(encrypted);

}
function dDEPRECATED_iecryptMixed(copy){

    encrypted =  document.getElementById("Mixed").innerHTML;
    decrypt(encrypted);

}
function DEPRECATED_idecrypt(copy){

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

function DEPRECATED_iobfuscateEncrypted(){
	var mixed = document.getElementById("Mixed");
	mixed.innerHTML = obfuscate(document.getElementById("Encrypted").innerHTML);
}
	
function DEPRECATED_iobfuscate(textBlock) {
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
//This function takes a password type string and salt and
// reutrns a key of length 128 for use as the Document Key	
function makeAESkey() {
	var bitKey, hexString = "",  keyArray = [] ,  AesKey;

	bitKey = sjcl.misc.pbkdf2("TEST_STRINGS","TO_BE_UPDATED",1000, 128);
	hexString = sjcl.codec.hex.fromBits(bitKey);
	for(i = 0; i < 4; i++) {
		keyArray[i] = hexString.slice((i*8), ((i+1) * 8) - 1);
	}
	AesKey = new sjcl.cipher.aes(keyArray);
	return AesKey;
}



//BASE64 output encryption of single character

function encryptChar(doChar, AesKey, ctr) {
        iv = "00000000000000000000000000000000",
        adata = "Adata",
        cipherText="",
        word = sjcl.codec.utf8String.toBits(doChar);
        cipherText = sjcl.mode.gcm.encrypt(AesKey, word, iv, adata, 128, ctr);
	base64output = sjcl.codec.base64.fromBits(cipherText);
        //console.log(i, cipherText)
         return base64output;
    }
//UTF-8  output char, decryption of 24 character BASE64 representation
function decryptChar(encryptedChar, AesKey, ctr) {
        iv = "00000000000000000000000000000000",
        adata = "Adata";
	bitInput = sjcl.codec.base64.toBits(encryptedChar);
        bitOutput = sjcl.mode.gcm.decrypt(AesKey, bitInput, iv, adata, 128, ctr);
	utf8String = sjcl.codec.utf8String.fromBits(bitOutput);
	return utf8String;
    }

