
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
function decrypt(){

    var key = ["0ac1","0ac1","0ac1","0ac1"]; 
    
    var prp = new sjcl.cipher.aes(key); 
    var copy =  document.getElementById("Encrypted").innerHTML,
        out =   document.getElementById("Plain After"),
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
	console.log(counter[3]);
	inChar = "";
	toBeDecrypted = "";
	//Place base64 stream in buffer
	while(inChar != "@") {
		toBeDecrypted = toBeDecrypted.concat(inChar);
		inChar =copy.charAt(n);
		n++;
	}
	console.log(toBeDecrypted);
        toBeDecryptedC = sjcl.codec.base64.toBits(toBeDecrypted);
	outChar = decryptChar(toBeDecryptedC, prp,counter);
	outStr = outStr.concat(sjcl.codec.utf8String.fromBits(outChar));
	console.log("outStr = ", outStr);
	inChar = "";
	//counter[3]++;
    }
    out.innerHTML = outStr;
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

