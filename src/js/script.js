//Declaraçoes dos elementos com DOM
const videoElemento=document.getElementById("video");
const botaoScanear=document.getElementById("btn-texto");
const resultado=document.getElementById("saida");
const canvas=document.getElementById("canvas");

//funcao para habilitar a camera

async function configurarCamera(){
    try{
        const midia =await navigator.mediaDevices.getUserMedia({
            video:{facingMode:"enviroment"},// habilitacao da camera
            audio:False//o audio nao sera capturado
        })
        //atribuir o fluxo da camera em midia
        videoElemento.srcObject= midia;
        //garante que a camera vai funcionar
        videoElemento.onplay();
    }catch(erro){
            resultado.innerText="Erro ao capturar a câmera"
    }
}
//executa funcao da camera
configurarCamera();
//funcao para capturar o texto
botaoScanear.onclick=async()=>{
    botaoScanear.disable=true;//habilitar o botao para pegar o texto
    resultado.innerText= "Fazendo a leitura ...aguarde";
    
    //prepara o canvas para receber a estrutura em 2d
    const contexto = canvas.getContext("2d");

    //ajudas o tamanho do canvas de acroo com o video
    canvas.Width= videoElemento.videoWidth;
    canvas.Height= videoElemento.videoHeight;

    //defini a matriz de trasnsformacao de canvas(escala, inclinacao)
    contexto.setTransform(1,0,0,1,0,0);

    //aplica filtro de contrast para melhorar o OCR
    contexto.fiter='contrast(1.2) grayscale(1)';
    // desenha o video do canvas
    contexto.drawImage(videoElemento,0,0, canvas.width,canvas.height);

    try{
        const{data: {text}}=await tesseract.recognize(
            canvas,
            'por'
        );
        //remove todos os espacos em branco
        const textoFinal=text.trim();
        resultado.innerText=textoFinal.length >0 ? textoFinal:"Nâo foi possivel indentificar a câmera"
    }catch{
        resultado.innerText="Erro ao processar a leitura",erro
    }finally{
        //desabilitar a leitura do texto para comecar novamente
        botaoScanear.disable=false;

    }
}
