let buttons = document.querySelectorAll(".buttonNotSelected");

for (var i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener("click", function () {
		console.log("hop");
		this.classList.toggle(".buttonSelected");
	});
}
