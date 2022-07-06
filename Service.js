import {HuffmanTree} from './HuffmanTree.js';

document.querySelector('#eButton').addEventListener('click', calculate);
document.querySelector('#phrases1').addEventListener('click', setPhrases);
document.querySelector('#phrases1').myParam = 0;
document.querySelector('#phrases2').addEventListener('click', setPhrases);
document.querySelector('#phrases2').myParam = 1;
document.querySelector('#phrases3').addEventListener('click', setPhrases);
document.querySelector('#phrases3').myParam = 2;
document.querySelector('#cButton').addEventListener('click', setDefault);   
let tree; 

export function calculate() {
    const data = document.getElementById('data').value;
    if(data != "") {
        tree = new HuffmanTree(data);  
        tree.basicInformation();
        tree.detailedInformation();
        console.log(tree)
        if(tree.huffmanTree.char == "")
            tree.drawHuffmanTree();
        else {
            tree.cleanCanvas();
        }
    }
    
}

export function setPhrases(evt) {

    const phrases = [
        "Hello world!",
        "Adrian Szafrański",
        "She sells seashells by the seashore, The shells she sells are seashells, I'm sure. So if she sells seashells on the seashore, Then I'm sure she sells seashore shells."
    ]

    document.getElementById('data').value = phrases[evt.currentTarget.myParam];
}

export function setDefault() {

    document.getElementById('data').value = "";
    tree.cleanResults();
   
   
}