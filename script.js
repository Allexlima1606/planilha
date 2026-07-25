let dividas = JSON.parse(localStorage.getItem("dividas")) || [];

let editando = null;

let grafico;



// FORMATAR DINHEIRO

function dinheiro(valor){

    return Number(valor).toLocaleString("pt-BR",{
        style:"currency",
        currency:"BRL"
    });

}





// SALVAR NO NAVEGADOR

function salvarStorage(){

    localStorage.setItem(
        "dividas",
        JSON.stringify(dividas)
    );

}





// ADICIONAR OU EDITAR

function salvarDivida(){


    let credor =
    document.getElementById("credor").value;


    let valor =
    Number(document.getElementById("valor").value);


    let parcelas =
    Number(document.getElementById("parcelas").value);


    let parcelasPagas =
    Number(document.getElementById("parcelasPagas").value);


    let valorParcela =
    Number(document.getElementById("valorParcela").value);



    if(!credor || !valor || !parcelas){

        alert("Preencha os campos obrigatórios");

        return;

    }



    let divida = {

        id: Date.now(),

        credor,

        valor,

        parcelas,

        parcelasPagas,

        valorParcela

    };





    if(editando){

        let index =
        dividas.findIndex(
            d=>d.id===editando
        );


        dividas[index]=divida;


        editando=null;


    }else{


        dividas.push(divida);


    }



    salvarStorage();


    limparFormulario();


    renderizar();


}





// LIMPAR CAMPOS

function limparFormulario(){

    document.getElementById("credor").value="";
    document.getElementById("valor").value="";
    document.getElementById("parcelas").value="";
    document.getElementById("parcelasPagas").value="";
    document.getElementById("valorParcela").value="";

}





// MOSTRAR DADOS

function renderizar(){


    let lista =
    document.getElementById("lista");


    lista.innerHTML="";



    let pesquisa =
    document.getElementById("pesquisa").value
    .toLowerCase();



    let filtro =
    document.getElementById("filtro").value;



    let total=0;
    let pago=0;
    let restante=0;




    dividas
    .filter(d=>{


        let nome =
        d.credor.toLowerCase()
        .includes(pesquisa);



        let valorPago =
        d.parcelasPagas *
        d.valorParcela;



        let status =
        d.parcelasPagas >= d.parcelas
        ? "quitada"
        : "aberta";



        if(filtro!="todos" &&
           filtro!=status){

            return false;

        }


        return nome;


    })

    .forEach(d=>{


        let valorPago =
        d.parcelasPagas *
        d.valorParcela;



        let falta =
        d.valor - valorPago;



        if(falta<0){

            falta=0;

        }



        let porcentagem =
        (valorPago / d.valor)*100;



        if(porcentagem>100){

            porcentagem=100;

        }




        total += d.valor;

        pago += valorPago;

        restante += falta;




        let status =
        d.parcelasPagas >= d.parcelas
        ?
        `<span class="quitada">
        Quitada
        </span>`
        :
        `<span class="aberta">
        Em andamento
        </span>`;





        lista.innerHTML += `


<tr>

<td>${d.credor}</td>


<td>${dinheiro(d.valor)}</td>


<td>${d.parcelas}</td>


<td>${d.parcelasPagas}</td>


<td>${dinheiro(d.valorParcela)}</td>



<td>


<div class="progresso">

<div style="width:${porcentagem}%">

</div>

</div>


${porcentagem.toFixed(0)}%

</td>



<td>${status}</td>



<td>

<button 
class="editar"
onclick="editar(${d.id})">

✏️

</button>


<button 
class="excluir"
onclick="excluir(${d.id})">

🗑️

</button>


</td>


</tr>


`;



    });





    document.getElementById("total")
    .innerHTML=dinheiro(total);


    document.getElementById("pago")
    .innerHTML=dinheiro(pago);


    document.getElementById("restante")
    .innerHTML=dinheiro(restante);



    atualizarGrafico(
        pago,
        restante
    );

}





// EDITAR

function editar(id){


    let d =
    dividas.find(
        x=>x.id===id
    );



    document.getElementById("credor").value=d.credor;

    document.getElementById("valor").value=d.valor;

    document.getElementById("parcelas").value=d.parcelas;

    document.getElementById("parcelasPagas").value=d.parcelasPagas;

    document.getElementById("valorParcela").value=d.valorParcela;



    editando=id;



    window.scrollTo({

        top:0,

        behavior:"smooth"

    });


}





// EXCLUIR

function excluir(id){


    if(confirm("Excluir esta dívida?")){


        dividas =
        dividas.filter(
            d=>d.id!==id
        );


        salvarStorage();

        renderizar();


    }


}





// GRÁFICO

function atualizarGrafico(pago,restante){


    let ctx =
    document
    .getElementById("grafico");



    if(grafico){

        grafico.destroy();

    }




    grafico =
    new Chart(ctx,{

        type:"doughnut",

        data:{


            labels:[

                "Pago",

                "Restante"

            ],


            datasets:[{


                data:[

                    pago,

                    restante

                ],


                backgroundColor:[

                    "#22c55e",

                    "#ef4444"

                ]

            }]


        },


        options:{


            responsive:true,


        }


    });


}





// MODO ESCURO

function alternarTema(){


    document.body
    .classList
    .toggle("dark");



    localStorage.setItem(

        "tema",

        document.body.classList.contains("dark")

    );


}





// CARREGAR TEMA

if(
    localStorage.getItem("tema")
    ==="true"
){

    document.body
    .classList
    .add("dark");

}





// INICIAR

renderizar();