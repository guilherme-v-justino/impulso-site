'use strict';
(() => {
const grupos = [
["Ao levantar e descansar",["Levanta da caminha de primeira.","Faz mais de uma tentativa para levantar.","Troca de posição várias vezes antes de se acomodar.","Passou a sentar de um jeito diferente, por exemplo com uma perna esticada para o lado."]],
["Ao circular pela casa",["Circula pelos lugares de costume.","Escorrega em algum piso.","Para diante de um degrau ou móvel que costumava acessar.","Escolhe outro caminho para chegar ao mesmo lugar.","Arrasta uma ou mais patas no chão ao andar."]],
["Na hora da comida, da água e do banheiro",["Usa os potes e o lugar de fazer as necessidades como de costume.","Muda de posição várias vezes para comer ou beber.","Hesita para entrar na caixa de areia ou chegar ao local de costume."]],
["Nas brincadeiras e na companhia da família",["Procura pessoas, brinquedos ou outros animais como de costume.","Começa a brincar e para mais cedo que antes.","Passa mais tempo em um canto ou esconderijo."]],
["Durante os cuidados do dia a dia",["Aceita os cuidados habituais como de costume.","Se afasta quando alguém tenta pegá-lo no colo ou fazer carinho.","Muda de posição ou pede para parar durante a escovação ou a higiene."]],
["O que quero lembrar de comentar",["O comportamento varia conforme o horário.","Em casa ele age de um jeito diferente do que na clínica.","Tenho um vídeo ou uma foto que quero mostrar.","Quero contar uma situação que não apareceu nesta ficha."]],
["Quando percebo que manca",["Manca nos primeiros passos ao levantar.","Manca depois de passar bastante tempo deitado.","Percebo que manca em dias frios.","Manca depois de passear, correr ou brincar."]]
];
const chave="impulso-ficha-casa-v1";
let salvas=[];
try {salvas=JSON.parse(localStorage.getItem(chave)) || []} catch {}
for(const [i,[titulo,frases]] of grupos.entries()){
 const grupo=document.createElement("fieldset");
 const legenda=document.createElement("legend");
 legenda.textContent=titulo;grupo.append(legenda);
 for(const [j,frase] of frases.entries()){
  const linha=document.createElement("label");
  const caixa=document.createElement("input");
  caixa.type="checkbox";caixa.value=i+"-"+j;caixa.checked=Array.isArray(salvas)&&salvas.includes(caixa.value);
  linha.append(caixa,document.createTextNode(frase));grupo.append(linha);
 }
 const ficha = document.querySelector("form");
 if (i === 6) ficha.insertBefore(grupo, ficha.lastElementChild);
 else ficha.append(grupo);
}
function atualizarResumo(){
 const painel = document.querySelector("#resultado");
 const marcadas = Array.from(document.querySelectorAll("input:checked"));
 const assuntos = marcadas.filter(caixa => {
  const [grupo,item] = caixa.value.split("-").map(Number);
  return grupo >= 5 || item > 0;
 });
 painel.replaceChildren();
 const abertura = document.createElement("p");
 abertura.textContent = assuntos.length ? "Você pode começar a conversa por aqui:" : "Tem alguma cena da semana que você gostaria de contar? Os sinais e lembretes que marcar acima vão aparecer aqui.";
 painel.append(abertura);
 if (assuntos.length){
  const lista = document.createElement("ul");
  for (const caixa of assuntos){
   const linha = document.createElement("li");
   linha.textContent = caixa.parentElement.textContent;
   lista.append(linha);
  }
  painel.append(lista);
  const dica = document.createElement("p");
  dica.textContent = assuntos.some(caixa => caixa.value === "1-4")
   ? "Como você percebeu que seu pet arrasta as patas, fale com um veterinário e conte quando começou e se isso mudou nos últimos dias."
   : "Se algo chamou sua atenção, conte para a gente como foi a última vez que aconteceu. Já tem consulta marcada? Leve esta lista para a avaliação.";
  painel.append(dica);
 }
}
atualizarResumo();
document.querySelector("form").addEventListener("change",()=>{
 atualizarResumo();
 try {localStorage.setItem(chave,JSON.stringify(Array.from(document.querySelectorAll("input:checked"),item=>item.value)))} catch {document.querySelector("#aviso").textContent="Para guardar suas marcações, salve em PDF ou tire uma captura de tela antes de sair."}
});
document.querySelector("#ficha").addEventListener("submit", event => event.preventDefault());

})();
