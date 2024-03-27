const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting) {
            entry.target.classList.add('show'); 
        } else {
            entry.target.classList.remove('show')
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));
setTimeout(remTrans, 5000);
function remTrans(){
    col = document.getElementsByClassName('card')
    col[0].classList.remove('logo1')
    col[1].classList.remove('logo1')
    col[2].classList.remove('logo1')
}
setTimeout(remTransBtn, 15000);
function remTransBtn(){
    col = document.getElementsByClassName('btn')
    col[0].classList.remove('four')
    col[0].setAttribute("id", "border");
}