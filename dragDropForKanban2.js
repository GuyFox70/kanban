(function(){
	let wrapper = document.querySelector('#wrapper');
	let dragObj = {};

	wrapper.addEventListener('mousedown', actionForMouseDown);

	function actionForMouseDown(e){
		if (e.which != 1){return;}

		let elem = e.target.closest('.viewCard');

		if (!elem) return;

		dragObj.elem = elem;

		dragObj.downX = e.pageX;
		dragObj.downY = e.pageY;

		wrapper.addEventListener('mousemove', actionForMouseMove);

		function actionForMouseMove(e){
			if (!dragObj.elem) return;

			if (!dragObj.avatar) {

				let moveX = e.pageX - dragObj.downX;
				let moveY = e.pageY - dragObj.downY;

				if (Math.abs(moveX) < 3 && Math.abs(moveX) < 3){
					return;
				}

				dragObj.avatar = createAvatar(e);

				if (!dragObj.avatar){
					dragObj = {};
					return;
				}

				let coords = getCoords(dragObj.avatar);
				dragObj.shiftX = dragObj.downX - coords.left;
 				dragObj.shiftY = dragObj.downY - coords.top;

 				startDrag(e);
			}

			dragObj.avatar.style.width = '263px';
			dragObj.avatar.style.left = e.pageX - dragObj.shiftX + 'px';
			dragObj.avatar.style.top = e.pageY - dragObj.shiftY + 'px';

			return false;
		}

		wrapper.addEventListener('mouseup', actionForMouseUp);

		function actionForMouseUp(e) {
			if (dragObj.avatar){
				finishDrag(e);
			}
			dragObj = {};
		}

		function finishDrag(e) {
			let elemUnder = findNewParent(e);

			if (elemUnder.className == 'headerColumn'){

				elemUnder.nextElementSibling.firstElementChild.insertAdjacentHTML('beforeBegin', '<p class="viewCard">' + dragObj.avatar.innerHTML + '</p>');

				dragObj.avatar.parentElement.removeChild(dragObj.avatar);

				//wrapper.removeEventListener('mousedown', actionForMouseDown);
				wrapper.removeEventListener('mouseup', actionForMouseUp);
			} else if (elemUnder.className == 'viewCard'){

				elemUnder.insertAdjacentHTML('afterEnd', '<p class="viewCard">' + dragObj.avatar.innerHTML + '</p>');

				dragObj.avatar.parentElement.removeChild(dragObj.avatar);
					
				// wrapper.removeEventListener('mousedown', actionForMouseDown);
				wrapper.removeEventListener('mouseup', actionForMouseUp);
			} else {
				createAvatar(e).rollback();
			}
		}

		function findNewParent(e) {
			// взять элемент на данных координатах
			let elem = document.elementFromPoint(e.clientX, e.clientY);
			let elemObj = elem.getBoundingClientRect();
			let	elemUnder = document.elementFromPoint(elemObj.x - 3, elemObj.y - 3);

			return elemUnder;
		}

		function createAvatar(e) {

			// запомнить старые свойства, чтобы вернуться к ним при отмене переноса
			let avatar = dragObj.elem;
			let old = {
				parent: avatar.parentNode,
				nextSibling: avatar.nextSibling,
				position: avatar.position || '',
				left: avatar.left || '',
				top: avatar.top || '',
				zIndex: avatar.zIndex || ''
			  };

			// функция для отмены переноса
			avatar.rollback = function() {
				old.parent.insertBefore(avatar, old.nextSibling);
				avatar.style.position = old.position;
				avatar.style.left = old.left;
				avatar.style.top = old.top;
				avatar.style.zIndex = old.zIndex
			};

				return avatar;
		}

		function startDrag(e) {
			let avatar = dragObj.avatar;

			avatar.style.zIndex = 9999;
			avatar.style.position = 'absolute';
		}

		function getCoords(elem) {
			let box = elem.getBoundingClientRect();

			return {
				top: box.top + pageYOffset,
				left: box.left + pageXOffset
			};

		}

	}
}());