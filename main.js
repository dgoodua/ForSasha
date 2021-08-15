var idbreq=indexedDB.open('myDiary',2)
var db;
var objectStore;
var tbody= document.querySelector('tbody');
var form=document.forms[0];
var mutObs=[];


idbreq.onsuccess=function(e){db=e.target.result;console.log(db);fill()}
idbreq.onerror=function(e){console.log('something went wrong',e.target.errorCode)}
idbreq.onupgradeneeded=function(e){
    db=e.target.result;
    if(!db.objectStoreNames.contains('People')){
        objectStore=db.createObjectStore('People',{
        keyPath:'id'})}
    }

function store(mode){
    let tx = db.transaction('People',mode);
    console.log(tx)
    tx.onerror=function(){};
    
    tx.onsuccess=function(){};
    console.log(tx)
    let store=tx.objectStore('People')
    return store
}



// filling our table with idb records
function fill(){
let req=store('readonly').getAll()
req.onsuccess=()=>{
    let arr=req.result
    arr.forEach((e)=>{tbody.insertAdjacentHTML("beforeend",str(e))})
    }
}

function str({id,firstname,secondname,phone,gender,age}){
    return`<tr data-key="${id}">
    <td>${tbody.childElementCount+1}</td>
    <td data-th="firstname">${firstname}</td>
    <td data-th="secondname">${secondname}</td>
    <td data-th="phone">${phone}</td>
    <td data-th="gender">${gender}</td>
    <td data-th="age">${age}</td>
    <td><button class="delete">delete</button><button class="change">change</button></td>
</tr>`;}

function multipleHandler(e){
    const el=e.target;
    const ell=el.parentElement.parentElement
    if(el.classList.contains('delete')){
        
        let id=parseInt(ell.getAttribute('data-key'));
        let req=store('readwrite').delete(id)
        
        req.onsuccess=function(){
        ell.remove()
        let tds=tbody.querySelectorAll('tr>td:first-of-type')
        Array.from(tds).forEach((e1,i)=>{e1.innerText=`${i+1}`})}
        
        



    }
    else if(el.classList.contains('change')){ 
        
        let arr = [ell.children[1],ell.children[2],ell.children[3],ell.children[4],ell.children[5]];
        
        if(el.getAttribute('data-changed')==='true'){
            if(arr.every(elem=>!elem.classList.contains('wrong'))){
                let id=parseInt(ell.getAttribute('data-key'));

                    let data ={
                        id,
                        firstname: arr[0].innerText,
                        secondname: arr[1].innerText,
                        phone: arr[2].innerText,
                        gender: arr[3].innerText,
                        age: arr[4].innerText
                    };
                        store('readwrite').put(data).onsuccess=function(){

                console.log('edit',observer)    //press change second time
                mutObs.pop().disconnect()
                arr.forEach(e=>{e.classList.remove('right','wrong');e.contentEditable='false'})
                el.setAttribute('data-changed','false')
                let buttons=document.querySelectorAll('button')
                 Array.from(buttons).forEach((ele)=>{ele.removeAttribute('disabled')})}

                    
                }

                






                else{alert('Please fill all the fields correctly')}
        }
        else{
        el.setAttribute('data-changed','true')

        let buttons=document.querySelectorAll('button')
        Array.from(buttons).forEach((ele)=>{if(ele!==el){ele.setAttribute('disabled','true')}})
        
        

        arr.forEach(e=>{e.contentEditable='true'})
        var observer=new MutationObserver(function(mutations){
            console.log(mutations)
            mutations.forEach(e=>{

                let par=e.target.parentElement;
                let text = par.innerHTML
                
                let data = par.getAttribute('data-th');
                if(data!==null){
                let pattern = document.querySelector(`input[name="${data}"`).getAttribute('pattern')
                let reg=new RegExp(pattern)
                console.log(par,reg,text)
                if(text.match(reg)){par.classList.remove('wrong');par.classList.add('right')}
                else{par.classList.remove('right');par.classList.add('wrong')}
            }})
        })
        mutObs.push(observer)
        observer.observe(ell,{
            subtree:true,
            characterData:true,
            attributes:true
        })}
    }
    else if(el.tagName==='TD'&& el.children.length===0){
        console.log('sort')
    }
}
 
 function handler(e){
     e.preventDefault()
                let firstname=form.elements.firstname.value;
                let secondname=form.elements.secondname.value;
                let phone=form.elements.phone.value;
                let gender=form.elements.gender.value;
                let age=parseInt(form.elements.age.value);
                let id=Math.floor(Date.now()/1000);

        let data ={
            id,
            firstname,
            secondname,
            phone,
            gender,
            age
        };
        
            
            let req=store('readwrite').add(data)
            req.onsuccess=function(){
            console.log(data)

                tbody.insertAdjacentHTML("beforeend",str(data));
                Array.from(document.getElementsByTagName('input')).forEach(e=>{e.removeAttribute('style')})
                form.reset();
                document.querySelector('#wrapper').style.display='none';
                document.querySelector('.add').style.display='block';}  
    }
    



function checkInput(e){
    let reg=new RegExp(e.target.pattern)
    if(reg.test(e.target.value)){e.target.style.backgroundColor='#13d833';}
    else if(!reg.test(e.target.value)){e.target.style.backgroundColor='rgb(249 27 87)';}
}




document.querySelector('.add').onclick=function(e){e.target.style.display='none';
document.querySelector('#wrapper').style.display='block';}
form.addEventListener('change',checkInput,true)
form.addEventListener('submit',handler)
document.querySelector('table').addEventListener('click',multipleHandler,false)