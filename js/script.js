const L={
 dep:["Comercial","Callcenter","Marketing","Financeiro","Logística","Compras","Cadastro","Recursos Humanos","TI"],
 canal:["Grupo de WhatsApp","WhatsApp direto","Intra (Requisição ou Chamados)","SAC","Ligação","E-mail","Pessoalmente"],
 trava:["Não sei quem é o responsável pela informação","A resposta demora","A resposta vem incompleta","As regras mudam sem aviso","Cada setor me diz uma coisa","Outro motivo"],
 ajuda:["Um canal único para pedir informação","Prazo de resposta combinado entre os setores","Um responsável definido por etapa","Aviso quando cliente, preço ou regra mudar","Reuniões de alinhamento entre setores","Treinamento sobre o processo do outro setor"]
};
const $=id=>document.getElementById(id);
function opts(id,list,type,name){$(id).innerHTML=list.map(t=>`<label class="opt"><input type="${type}" name="${name}" value="${t}"><span>${t}</span></label>`).join('');}
opts('dep',L.dep,'checkbox','dep');opts('canal',L.canal,'checkbox','canal');opts('trava',L.trava,'radio','trava');opts('ajuda',L.ajuda,'checkbox','ajuda');
['s3','s4'].forEach(id=>{$(id).innerHTML=[1,2,3,4,5].map(n=>`<label><input type="radio" name="${id}" value="${n}"><b>${n}</b></label>`).join('');});
const vals=n=>[...document.querySelectorAll(`input[name="${n}"]:checked`)].map(e=>e.value);
document.addEventListener('change',e=>{if(e.target.name==='ajuda'&&vals('ajuda').length>3)e.target.checked=false;});
function done(){$('app').innerHTML='<div class="q done"><h2>Resposta enviada</h2><p>Obrigado por contribuir. Suas respostas vão ajudar a melhorar a comunicação entre os setores.</p><button type="button" id="outra" style="margin-top:20px">Enviar outra resposta</button></div>';$('outra').addEventListener('click',()=>location.reload());}
const form=$('f');
if(form)form.addEventListener('submit',async ev=>{
  ev.preventDefault();const er=$('erro');er.hidden=true;
  const setor=$('setor').value,s3=vals('s3')[0],s4=vals('s4')[0],trava=vals('trava')[0];
  if(!setor||!s3||!s4||!trava){er.textContent='Responda as perguntas marcadas com asterisco: setor, perguntas 3, 4 e 6.';er.hidden=false;er.scrollIntoView({block:'center'});return;}
  const btn=$('enviar');btn.disabled=true;btn.textContent='Enviando...';
  const payload={site:$('site').value,setor,atrasada:+s3,retrabalho:+s4,depende:vals('dep'),canais:vals('canal'),trava,exemplo:$('exemplo').value.trim(),ajuda:vals('ajuda')};
  try{
    const r=await fetch(APPS_SCRIPT_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
    const j=await r.json();
    if(!j.ok)throw new Error(j.erro||'falha');
    done();
  }catch(e){
    btn.disabled=false;btn.textContent='Enviar resposta';
    er.textContent='Não foi possível enviar agora. Confira sua conexão e tente de novo.';er.hidden=false;
  }
});
