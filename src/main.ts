// solution goes here
type CommentData={
    id:number
    content:string
    imageId:string
}
type Image={
    id:number
    title:string
    likes:number
    image:string
    comments:CommentData[]
}
type State={
    images:Image[]
}
let state:State ={
    images: []
}
function getImagesFromServer(){
fetch(`http://localhost:3333/images`)
.then(resp=>resp.json())
.then(getImagesFromServer=>{
    state.images=getImagesFromServer
    render()
})
}
function updateLikes (image) {
    return fetch(`http://localhost:3333/images/${image.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(image)
    }).then(resp => resp.json())
  }
function render(){
    let conteinerEl= document.querySelector<HTMLElement>(`.image-container`)
    if(conteinerEl===null) return 
    conteinerEl.textContent=""
    for(let image of state.images){
    let articleEl=document.createElement("article")
    articleEl.className=("image-card")

    let titleEl = document.createElement("h2")
    titleEl.className = 'title'
    titleEl.textContent = image.title

    let imgEl=document.createElement("img")
    imgEl.className=("image")
    imgEl.src=image.image

    let divEl=document.createElement("div")
    divEl.className=("likes-section")
    let spanEl=document.createElement("span")
    spanEl.className=("likes")
    spanEl.textContent=`${image.likes} likes`
    let buttonEl=document.createElement("button")
    buttonEl.className=("like-button")
    buttonEl.textContent=("♥")
    buttonEl.addEventListener("click" ,function(){
        image.likes++
        updateLikes(image)
        render()
    }) 
    divEl.append(spanEl,buttonEl)

    let ulEl=document.createElement("ul")
    ulEl.className=("comments")
    for(let coment of image.comments){
    let liEl=document.createElement("li")
    liEl.textContent=coment.content
    ulEl.append(liEl)
    }
    articleEl.append(titleEl, imgEl,divEl ,ulEl)
    conteinerEl.append(articleEl)
    }
}
getImagesFromServer()
render()