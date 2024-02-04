import{a as g,s as p,i as c}from"./assets/vendor-0741160b.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function s(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerpolicy&&(o.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?o.credentials="include":r.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(r){if(r.ep)return;r.ep=!0;const o=s(r);fetch(r.href,o)}})();const h="42188159-1454a2852e4ff5c9e0320bde0",y="https://pixabay.com/api/";function b({query:t,page:e=1,per_page:s=40}){const i=new URLSearchParams({q:t,page:e,per_page:s,key:h,image_type:"photo",orientation:"horizontal",safesearch:"true"});return g.get(`${y}?${i}`)}const n={searchForm:document.querySelector("#search-form"),gallery:document.querySelector("#gallery"),galleryEnd:document.querySelector("#gallery-end")},v=new p(".photo-card",{captionsData:"alt",sourceAttr:"data-image",captionDelay:250}),f=new IntersectionObserver((t,e)=>{t.forEach(s=>{s.isIntersecting&&E(e)})},{rootMargin:"250px"}),u=40;let l=1;n.searchForm.addEventListener("submit",L);async function L(t){t.preventDefault();try{I();const e=await d();e.totalHits!==0?c.success({title:"Success",position:"topRight",message:`Hooray! We found ${e.totalHits} images.`}):c.info({title:"Info",position:"topRight",message:"Sorry, there are no images matching your search query. Please try again."}),e.totalHits>u&&f.observe(n.galleryEnd)}catch(e){m(e)}}async function E(t){try{(await d(++l)).totalHits<=l*u&&(t.unobserve(n.galleryEnd),c.info({title:"Info",position:"topRight",message:"We're sorry, but you've reached the end of search results."}))}catch(e){m(e)}}async function d(t=1){l=t;const{data:e}=await b($(t));return e.hits.length>0&&(w(e.hits),S()),e}function S(){v.refresh()}function w(t){n.gallery.insertAdjacentHTML("beforeend",t.map(H).join(""))}function I(){n.gallery.innerHTML="",f.unobserve(n.galleryEnd)}function $(t=1){return{query:n.searchForm.elements.searchQuery.value,page:t,per_page:u}}function m(t){console.log(t),c.error({title:"Error",position:"topRight",message:t.message})}function H({webformatURL:t,largeImageURL:e,tags:s,likes:i,views:r,comments:o,downloads:a}){return`
    <div class="photo-card" data-image="${e}">
        <img class="photo-card-image" src="${t}" alt="${s}" loading="lazy" />
        <div class="info">
            <p class="info-item">
                <b>Likes</b><br>${i}
            </p>
                <p class="info-item">
            <b>Views</b><br>${r}
            </p>
            <p class="info-item">
                <b>Comments</b><br>${o}
            </p>
            <p class="info-item">
                <b>Downloads</b><br>${a}
            </p>
        </div>
    </div>`}
//# sourceMappingURL=commonHelpers.js.map
