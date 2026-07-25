let dividas = JSON.parse(localStorage.getItem("dividas")) || [];

let editando = null;

let grafico;



function dinheiro(valor){

    return Number(valor || 0).toLocaleString("pt-BR",{
        style:"currency",
        currency:"BRL"
    });

}



// SALVAR

function salvarStorage(){

    localStorage.setItem(
        "dividas",
        JSON.stringify(dividas)
    );

}



// SALVAR OU EDITAR

function salvarDivida(){

    let credor =
    document.getElementById("credor").value.trim();


    let valor =
    Number(document.getElementById("valor").value);


    let parcelas =
    Number(document.getElementById("parcelas").value);


    let parcelasPagas =
    Number(document.getElementById("parcelasPagas").value);


    let valorParcela =
    Number(document.getElementById("valorParcela").value);


    let categoria =
    document.getElementById("categoria").value;



    if(!credor || !valor || !parcelas){

        alert("Preencha os campos obrigatórios");

        return;

    }



    let divida = {

        id: editando || Date.now(),

        credor,

        valor,

        parcelas,

        parcelasPagas,

        valorParcela,

        categoria

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



// LIMPAR

function limparFormulario(){

    document.getElementById("credor").value="";
    document.getElementById("valor").value="";
    document.getElementById("parcelas").value="";
    document.getElementById("parcelasPagas").value="";
    document.getElementById("valorParcela").value="";

}



// RENDER

function renderizar(){


    let lista =
    document.getElementById("lista");


    lista.innerHTML="";



    let pesquisa =
    document.getElementById("pesquisa").value.toLowerCase();


    let filtro =
    document.getElementById("filtro").value;



    let total=0;

    let pago=0;

    let restante=0;

    let quantidade=0;



    dividas
    .filter(d=>{


        let nome =
        d.credor.toLowerCase()
        .includes(pesquisa);



        let status =
        d.parcelasPagas >= d.parcelas
        ? "quitada"
        : "aberta";



        if(
            filtro!="todos" &&
            filtro!=status
        ){

            return false;

        }


        return nome;


    })

    .forEach(d=>{


        quantidade++;


        let valorPago =
        d.parcelasPagas *
        d.valorParcela;



        let saldo =
        d.valor - valorPago;



        if(saldo < 0){

            saldo=0;

        }



        let restam =
        d.parcelas - d.parcelasPagas;



        total += d.valor;

        pago += valorPago;

        restante += saldo;



        let porcentagem =
        (valorPago / d.valor) * 100;



        if(porcentagem > 100){

            porcentagem=100;

        }



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

<td>${d.categoria || "Outros"}</td>

<td>${dinheiro(d.valor)}</td>

<td>${d.parcelas}</td>

<td>${d.parcelasPagas}</td>

<td>${restam}</td>

<td>${dinheiro(d.valorParcela)}</td>

<td>${dinheiro(saldo)}</td>

<td>-</td>

<td>${status}</td>

<td>

<button class="editar"
onclick="editar(${d.id})">

✏️

</button>


<button class="excluir"
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



    document.getElementById("quantidade")
    .innerHTML=quantidade;



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



    if(!d) return;



    document.getElementById("credor").value=d.credor;

    document.getElementById("valor").value=d.valor;

    document.getElementById("parcelas").value=d.parcelas;

    document.getElementById("parcelasPagas").value=d.parcelasPagas;

    document.getElementById("valorParcela").value=d.valorParcela;


    document.getElementById("categoria").value =
    d.categoria || "Outros";



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


    let canvas =
    document.getElementById("grafico");


    if(!canvas){

        return;

    }



    if(grafico){

        grafico.destroy();

    }



    grafico =
    new Chart(canvas,{

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

        }

    });


}



// TEMA

function alternarTema(){


    document.body
    .classList
    .toggle("dark");



    localStorage.setItem(

        "tema",

        document.body.classList.contains("dark")

    );


}



if(
localStorage.getItem("tema")==="true"
){

    document.body.classList.add("dark");

}



// INICIO

renderizar();