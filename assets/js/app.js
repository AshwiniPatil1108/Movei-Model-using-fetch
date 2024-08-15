const cl = console.log;

const movieContainer = document.getElementById("movieContainer")
const backDropId = document.getElementById("backDropId")
const movieModalId = document.getElementById("movieModalId")
const addMovieBtn = document.getElementById("addMovieBtn")
const movieForm = document.getElementById("movieForm")
const titleControl = document.getElementById("title")
const imageUrlControl = document.getElementById("imageUrl")
const contentControl = document.getElementById("content")
const ratingControl = document.getElementById("rating")
const movieSubmitBtn = document.getElementById("movieSubmitBtn")
const movieUpdateBtn = document.getElementById("movieUpdateBtn")
const movieCloseBtn = [...document.querySelectorAll('.movieClose')]
const loader = document.getElementById("loader")


const BASE_URL = `https://moveimodel-24812-default-rtdb.asia-southeast1.firebasedatabase.app`;

const MOVEI_URL =`${BASE_URL}/movei.json`;

const sweetAlert = (msg, icon)=>{
   Swal.fire({
      title: msg,
      timer : 2500,
      icon : icon
   })
}

const createMovieCards=(arr)=>{
   let result ='';

arr.forEach(movie =>{
    result += `
         <div class="col-md-4">
            <div class="card movieCard" id="${movie.id}">
               <figure class="m-0">
                  <img src="${movie.imageUrl}" alt="" title="">

                  <figcaption>
                     <h2 class="font-weight-bold">${movie.title}</h2>
                     <strong>Rating:${movie.rating}/5</strong>
                     <p class="content">
                        ${movie.content}
                     </p>
                     <div class="d-flex justify-content-between">
                        <button class="btn btn-sm nfx-btn bg-light" onclick="onEdit(this)">
                           Edit
                        </button>
                        <button class="btn btn-sm nfx-btn text-white" onclick="onDelete(this)">
                           Remove
                        </button>
                     </div>
                  </figcaption>
               </figure>
            </div>
         </div>
    `
    movieContainer.innerHTML =result;
})
}

const makeApiCall = (methodName, apiurl, msgbody)=>{
   msgbody = msgbody ? JSON.stringify(msgbody):null

   //api cl >> loader show 
   loader.classList.remove("d-none");

   return fetch(apiurl, {
      method : methodName,
      body: msgbody,
      headers:{
         token :'get a JWT Token from Local storage'
      }
   })
   .then(res =>{
      return res.json()
   })
  
}

const fetchmovie = ()=>{
   makeApiCall("GET", MOVEI_URL)
   .then(data => {
      cl(data)
      let moveiArr =[]
      for(const key in data){
         moveiArr.unshift({...data[key], id:key})
      }
      createMovieCards(moveiArr)
   })
   .catch(err=>{
      sweetAlert(err, "error")
   })
   .finally(()=>{
      loader.classList.add("d-none")
   })

}
fetchmovie()

const toggleModalBackDrop=() =>{
   backDropId.classList.toggle('visible');
   movieModalId.classList.toggle('visible');
   movieUpdateBtn.classList.add('d-none');
   movieSubmitBtn.classList.remove('d-none');

   movieForm.reset();
}


const onMovieAdd=(eve)=>{
   eve.preventDefault();
   let movieObj ={
      title: titleControl.value,
      imageUrl:imageUrlControl.value,
      content:contentControl.value,
      rating:ratingControl.value,
   }

   cl(movieObj);
   //api call  

   makeApiCall("POST", MOVEI_URL, movieObj)
      .then(res=>{
         cl(res)
         movieObj.id = res.name
         let card =document.createElement('div');
         card.className ='col-md-4';
         card.innerHTML =
               `
                        <div class="card movieCard" id="${movieObj.id}">
                           <figure class="m-0">
                              <img src="${movieObj.imageUrl}" alt="" title="">

                              <figcaption>
                                 <h2 class="font-weight-bold">${movieObj.title}</h2>
                                 <strong>Rating:${movieObj.rating}/5</strong>
                                 <p class="content">
                                    ${movieObj.content}
                                 </p>
                                 <div class="d-flex justify-content-between">
                                    <button class="btn btn-sm nfx-btn bg-light" onclick="onEdit(this)">
                                       Edit
                                    </button>
                                    <button class="btn btn-sm nfx-btn text-white" onclick="onDelete(this)">
                                       Remove
                                    </button>
                                 </div>
                              </figcaption>
                           </figure>
                        </div>
               `
               movieContainer.prepend(card)
               toggleModalBackDrop();
               sweetAlert("MOVIE ADDED SUCCESSFULLYY!!","success")
      })
      .catch(err =>sweetAlert(err, 'error'))
      .finally(()=>{
         loader.classList.add("d-none")
         movieForm.reset()
      })

}



const onEdit = (ele)=>{
   toggleModalBackDrop();
   let EDIT_ID = ele.closest('.card').id;
   localStorage.setItem("editId", EDIT_ID)
   cl(EDIT_ID)
   //EDIT_URL 
   let EDIT_URL =`${BASE_URL}/movei/${EDIT_ID}.json`;
   //api call 
   makeApiCall("GET", EDIT_URL)
      .then(res=>{
         cl(res)
         titleControl.value = res.title;
         contentControl.value = res.content;
         imageUrlControl.value = res.imageUrl;
         ratingControl.value =res.rating;

         movieUpdateBtn.classList.remove('d-none');
         movieSubmitBtn.classList.add('d-none');
      })
      .catch(err=>{
         sweetAlert(err, "error")
      })
      .finally(()=>{
         loader.classList.add("d-none")
      })
}


const onMovieUpdate =()=>{
   let UPDATED_ID = localStorage.getItem('editId')
   let UPDATED_OBJ = {
      title:titleControl.value,
      imageUrl:imageUrlControl.value,
      content:contentControl.value,
      rating:ratingControl.value,
     
   }

   let UPDATED_URL =`${BASE_URL}/movei/${UPDATED_ID}.json`
   makeApiCall("PATCH", UPDATED_URL, UPDATED_OBJ)
   .then(res=>{
      cl(res)
      let card = document.getElementById(UPDATED_ID);
      cl(card)
      card.innerHTML=`
                           <figure class="m-0">
                              <img src="${res.imageUrl}" alt="" title="">

                              <figcaption>
                                 <h2 class="font-weight-bold">${res.title}</h2>
                                 <strong>Rating:${res.rating}/5</strong>
                                 <p class="content">
                                    ${res.content}
                                 </p>
                                 <div class="d-flex justify-content-between">
                                    <button class="btn btn-sm nfx-btn bg-light" onclick="onEdit(this)">
                                       Edit
                                    </button>
                                    <button class="btn btn-sm nfx-btn text-white" onclick="onDelete(this)">
                                       Remove
                                    </button>
                                 </div>
                              </figcaption>
                           </figure>
      
      
      `
     
       toggleModalBackDrop();
       sweetAlert("MOVIE UPDATED SUCCESSFULLYY!!","success")
   })
   .catch(err=>{
      sweetAlert(err, "error")
   })
   .finally(()=>{
      loader.classList.add("d-none")
   })
      


}



const onDelete = (ele) =>{

   Swal.fire({
       title: "Are you sure?",
       text: "You won't to removed this post!",
       icon: "warning",
       showCancelButton: true,
       confirmButtonColor: "#3085d6",
       cancelButtonColor: "#d33",
       confirmButtonText: "Yes, remove it!"
     }).then((result) => {
       if (result.isConfirmed) {
           //removeId
           let removeId = ele.closest(`.card`).id;

           //removeURL

           let REMOVE_URL = `${BASE_URL}/movei/${removeId}.json`
           //API call
           makeApiCall("DELETE", REMOVE_URL)
           .then(res =>{
               ele.closest(`.card`).parentElement.remove();
               sweetAlert("MOVIE REMOVE SUCCESSFULLYY !!!","success");
           })
           .catch(err =>{
            sweetAlert(err,"error")
           })
           .finally(()=>{
            loader.classList.add('d-none')
        })

       }
     });
}





movieCloseBtn.forEach(btn=>{
   btn.addEventListener('click',toggleModalBackDrop);
  
})
addMovieBtn.addEventListener('click',toggleModalBackDrop);//4
movieForm.addEventListener('submit', onMovieAdd);
movieUpdateBtn.addEventListener('click',onMovieUpdate);