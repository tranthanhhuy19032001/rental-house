//Prevent load page current when btnInfo clicked
const btnInfoUser = document.getElementById('btn-current-location');

if (btnInfoUser.href === location.href) {
    btnInfoUser.onclick = function (e) {
        e.preventDefault();
    };
}
