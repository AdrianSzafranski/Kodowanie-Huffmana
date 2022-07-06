import {Node} from './Node.js';

export class HuffmanTree {  
    constructor(data){  
        var container = document.getElementById("enterPhrase");
        container.classList.remove("enterPhraseDefault");
        container.classList.add("enterPhraseResults");

        this.data = data;
        this.freqChars = this.countChars(data);
        this.huffmanTree = this.buildTree();  
        this.encodedChars = {};

        if(this.huffmanTree.char != "") {
            this.encodedChars[this.huffmanTree.char] = "0";
        } else {
            this.encodeChars(this.huffmanTree, "");  
        } 

        this.encodedData = this.encodeData(this.data, this.encodedChars); 
        var calcResult = this.calcEntropyAndMediumLength(); 
        this.entropy = calcResult[0];
        this.mediumLength = calcResult[1];
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
    }  

    countChars(data) {

        const freqChars = {};
        data.split('').forEach(function (x) { 
            freqChars[x] = (freqChars[x] || 0) + 1; 
        });
    
        return freqChars;
    }

    buildTree() {
        let nodes = [];
        for(let char in this.freqChars){  
            let node = new Node(this.freqChars[char], char); 
            nodes.push(node);  
        }  

        while(nodes.length !== 1){  
            console.log(nodes)
            nodes.sort((a, b) => { 
                var x = -1; 
                if(a.leftChild == undefined)  x = 1;

                return a.value - b.value || x;  
            });  
  
            let node = new Node(
                nodes[0].value + nodes[1].value, 
                '',
                JSON.parse(JSON.stringify(nodes[0])),
                JSON.parse(JSON.stringify(nodes[1]))
                );
           
            nodes = nodes.slice(2);  
            nodes.push(node);  
        }  
  
        return nodes[0];  

    }

    encodeChars(node, path) {  

        if(node.char == "") {
            this.encodeChars(node.leftChild, path + '0');  
            this.encodeChars(node.rightChild, path + '1');  
        }
        else {
            this.encodedChars[node.char] = path;
        }
    }

    encodeData(str, asCodes){
        var output = "";
        for (var i=0; i<str.length; i++){
            output = output+asCodes[str[i]];
        }
        return output;
    }

    calcEntropyAndMediumLength() {
       
        var entropy = 0;
        var len = 0;
        for(let char in this.freqChars){
            var probability = this.freqChars[char]/this.data.length;  
            entropy = entropy + probability*Math.log2(1/probability);
            len = len + (probability*this.encodedChars[char].length);
        }  

        return [entropy, len];
       
    }

    basicInformation() {
        
        document.querySelector('#basicInformation').innerHTML = 
        `<div id="basicInfo">
            <div class="basicInformationTitle">Wyrażenie</div>
            <div id="PhraseValue">${this.data}</div>
            
            <div class="basicInformationTitle">Zakodowane wyrażenie</div>
            <div id="encodedPhraseValue">${this.encodedData}</div>
        
            <div class="basicInformationGroup">
                <div class="basicInformationTitle">Wartość entropii</div>
                <div id="entropyValue">${Math.round(this.entropy*100)/100}</div>
            </div>
            
            <div class="basicInformationGroup">
                <div class="basicInformationTitle">Średnia długość słowa kodowego</div>
                <div id="mediumLengthPhraseValue">${Math.round(this.mediumLength*100)/100}</div>
            </div>
            <div style="clear: both"></div>
        </div>`;
    }

    detailedInformation() {
   
        var sorttableData = [];
        for (var char in this.encodedChars){
            sorttableData.push([char, this.encodedChars[char], this.freqChars[char], (Math.round((this.freqChars[char]/this.data.length)*100)/100)]);
        }
      
        sorttableData.sort((a, b) => {  
            return a[1].length - b[1].length || b[2] - a[2];  
        });  


        document.querySelector('#detailedInformation').innerHTML = '';
        const table = document.getElementById('detailedInformation'), tbl = document.createElement('table');
    
        tbl.classList.add("detInfoTable");

        const trHeader = tbl.insertRow();
        trHeader.classList.add("detInfoTableHeader");

        var headers = ["Znak", "Kod", "Ilość wystąpień", "Prawdopodobieństwo"];
        for(var i in headers) {
            const tdHeader = trHeader.insertCell();
            tdHeader.appendChild(document.createTextNode(headers[i]));
        }
        
        for (var i in sorttableData) { 
            const tr = tbl.insertRow();
            tr.classList.add("detInfoTableRows");
           
            const tdZnak = tr.insertCell();

            if(sorttableData[i][0] == " ") {
                tdZnak.appendChild(document.createTextNode('spacja'));
            }
            else {
                tdZnak.appendChild(document.createTextNode(sorttableData[i][0]));
            }
                
            for(var j=1; j<sorttableData[i].length; j++) {
                const td = tr.insertCell();
                td.appendChild(document.createTextNode(sorttableData[i][j]));
            }   

        }
        table.appendChild(tbl);
        
    }
    
    drawHuffmanTree() {
       
        var container = document.getElementById("graphicHuffmanTree");
        container.classList.add("graphicHuffmanTreeDetails");

        var sortAsCodes = [];

        for (var char in this.encodedChars){
            sortAsCodes.push([this.encodedChars[char], char]);
        }

        sortAsCodes.sort((a, b) => {  
            return b[0].length - a[0].length;  
        });  

        var treeDepth = (sortAsCodes[0][0]).length;
        var widthCanvas = (80+10)*Math.pow(2,treeDepth-1);
        //80 - szerokość dwóch węzłów(kułek/prostokątów) bez odstepów
        //10 - odstępy między węzłami oraz odstęp z lewej i prawej strony wykresu. Odstępy między węzłami wynoszą 10px, a odstępy z lewej i prawej strony wykresu po 5px.
        var heightCanvas = 30+treeDepth*100+15+50;
        //30 - środek pierwszego(najwyższego) węzła(kółka) wraz z marginesem górnym wykresu(10px)
        //100*treeDeth  - każdy węzęł(kółko i prostokąt) jest od siebie oddalony poziomo o wartość 100px
        //15 - połowa wysokości węzła prostokąta - ponieważ wartości 100px są od środka do środka węzłów
        //50 - do rysowania cyfr pod najniższymi węzłami(prostokąty)

        if(self.innerHeight*0.9< heightCanvas) {  
            document.getElementById('graphicHuffmanTree').style.height = '90%';
        }
        else {
            document.getElementById('graphicHuffmanTree').style.height = heightCanvas+10+"px";
        }

        this.ctx.canvas.width = widthCanvas; 
        this.ctx.canvas.height = heightCanvas; 
      
        this.drawNode(this.huffmanTree, widthCanvas/2, 30, 45*Math.pow(2,treeDepth-2)); //40*Math.pow(2,treeDepth-1)+5*Math.pow(2,treeDepth-1)

    }

    drawNode(node, width, height, przesuniecie) {
      
        if(node.char == "") {
            this.drawNode(node.leftChild, width-przesuniecie, height+100, przesuniecie*0.5)
            this.drawNode(node.rightChild, width+przesuniecie, height+100, przesuniecie*0.5)

            this.ctx.beginPath();
            this.ctx.moveTo(width, height+20);
            this.ctx.lineTo(width-przesuniecie, height+100-20);
            this.ctx.stroke();
    
            this.ctx.beginPath();
            this.ctx.moveTo(width, height+20);
            this.ctx.lineTo(width+przesuniecie, height+100-20);
            this.ctx.stroke();

            this.ctx.fillStyle = 'black';
            this.ctx.font = "20px Arial";
            this.ctx.fillText(0, width-33, height+20); 
            this.ctx.font = "20px Arial";
            this.ctx.fillText(1, width+20, height+20); 

            this.ctx.fillStyle="#202020";
            this.ctx.beginPath();
            this.ctx.arc(width,  height,  20 , 0, 2 * Math.PI, false);
            this.ctx.fill();

            this.ctx.fillStyle = '#d3d0d0';
        }
        else {
            this.ctx.fillStyle = '#9b9614';
            this.ctx.font = "25px Arial";
    
                if(node.char==" ") {
                    this.ctx.font = "18px Arial";
                    this.ctx.fillText('spacja', width-26, height+50); 
                }
                else {
                    this.ctx.fillText(node.char, width-8, height+50);
                } 
    
                this.ctx.fillStyle = "#7a7951";
                this.ctx.fillRect(width-20, height-15, 40, 30);  
                
                

                this.ctx.fillStyle = 'black';
        }

            if(node.value>=100) {
                this.ctx.font = "16px Arial";
                this.ctx.fillText(node.value, width-13, height+6); 
              
            }
            else if(node.value>=10){
                this.ctx.font = "20px Arial";
                this.ctx.fillText(node.value, width-12, height+7); 
            }
            else {
                this.ctx.font = "20px Arial";
                this.ctx.fillText(node.value, width-6, height+7); 
            }
    
    }

    cleanResults() {
        var container = document.getElementById("enterPhrase");
        container.classList.remove("enterPhraseResults");
        container.classList.add("enterPhraseDefault");
        document.querySelector('#basicInformation').innerHTML = "";
        document.querySelector('#detailedInformation').innerHTML = "";

        this.cleanCanvas();
    }

    cleanCanvas() {
        var graphicHuffmanTree = document.getElementById("graphicHuffmanTree");
        graphicHuffmanTree.classList.remove("graphicHuffmanTreeDetails");
        document.getElementById('graphicHuffmanTree').style.height = '0%';

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.width = 0;
        this.canvas.height = 0;
    }
    
}