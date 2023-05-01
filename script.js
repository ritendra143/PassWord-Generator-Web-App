const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='~!@#$%^&*()_+=-;:"<,>.?/';

let password="";
let passwordLength=10;
let checkCount=0;

//Call HandleSlider:
handleSlider();



//Set Strength circle color Grey:
setIndicator("#ccc");


//Set Password Length:
function handleSlider(){ //This function reflects the password length on UI only.
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    //Aur kuch bhi add karna hai.
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength -min)*100/(max-min))+"%100%";
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //Set Shadow:
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123))  //97--->a  , 123--->z 
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91))  //65--->A  , 91--->Z 
}

function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if(
        (hasLower||hasUpper) && (hasNum||hasSym)&&passwordLength>=6){
            setIndicator("#ff0");
        }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value); // This writeText Method returns a promise , if promise get resolved then print in copyMsg is copied.
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }

    //Is line se to make copy wala span visible.
    copyMsg.classList.add("active");

    //To remove this with in 2 sec.
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    //There is Algo. Present for the Shuffling i.e Fisher Yates Method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });

    //Corner case i.e Special condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
});

generateBtn.addEventListener('click',()=>{
    //None of the checkBox is Selected
    if(checkCount==0) return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //Lets start  writing code to find the new Password.
    
    //remove old password.
    password="";

    //Lets put the stuff mentioned by the check Boxes.
    /*
    if(uppercaseCheck.checked){
        password+=generateUpperCase();
    }
    if(lowercaseCheck.checked){
        password+=generateLowerCase();
    }
    if(numbersCheck.checked){
        password+=generateRandomNumber;
    }
    if(symbolsCheck.checked){
        password+=generateSymbol();
    }
    */

    let funcArr=[];
    
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //Compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }    

    //remaining Addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndx = getRndInteger(0, funcArr.length);
        password += funcArr[randIndx]();
    }

    //Now Shuffle the generated password
    password=shufflePassword(Array.from(password));

    //Show the Shffled Password On the UI
    passwordDisplay.value=password;

    //Now the calculation of strength function
    calcStrength();

});

