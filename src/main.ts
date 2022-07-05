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
    let imageCopy={...image}
    delete imageCopy.coment
    return fetch(`http://localhost:3333/images/${image.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(imageCopy)
    }).then(resp => resp.json())
  }
  function createNewComment(content, imageId){
    fetch('http://localhost:3333/comments', {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        content,
          imageId
        
      })
})
    .then(resp => resp.json())
    .then(newComment =>{
        let image= state.images.find(image=> image.id===newComment.imageId)
        image?.comments.push(newComment)
        render(imageId)
    })
    
    
  }
  function deleteComent(comentId:number){
    fetch(`http://localhost:3333/images/${comentId}`, {
        method:`Delete`
    }).then(()=>{
        getImagesFromServer()
    })
  
  }
  function createdeletedButton(comment:CommentData, commentsUl:HTMLElement){
    let buttonrubishLi= document.createElement("li")
    buttonrubishLi.className="comment"
    let buttonrubishSpan= document.createElement("span")
    buttonrubishSpan.textContent=comment.content

    let buttonrubish= document.createElement("button")
    buttonrubish.textContent=("🗑")
    buttonrubish.addEventListener(`click`, function(){
        deleteComent(comment.id)
    })

    buttonrubishLi.append(buttonrubish,buttonrubish)
    commentsUl.append(buttonrubishLi)

  }
function render(imageId){
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
        render(imageId)
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

    let formiEl=document.createElement("form")
    formiEl.className=("comment-form")
    formiEl.addEventListener("submit", function(event)
    {
      event.preventDefault()
      createNewComment(inputEl.value, image.id)
     render(imageId)
    })
    let inputEl=document.createElement("input")
    inputEl.className=("comment-input")
    inputEl.type="text"
    inputEl.name="comment"
    inputEl.placeholder="Add a comment..."
      let buttonEl2=document.createElement("button")
      buttonEl2.className=("comment-button")
      buttonEl2.type="submit"
      buttonEl2.textContent=("Post")
      for(let comment of image.comments.slice(-4)){
      createdeletedButton(comment, inputEl)}
      
    formiEl.append(inputEl, buttonEl2)
    conteinerEl.append(articleEl, formiEl)

    }
}
getImagesFromServer()
render(Image)