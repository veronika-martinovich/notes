document.addEventListener('DOMContentLoaded', function(){

    let board = document.querySelector('.board');
    let addNote = document.querySelector('.add-note');
    let dragNote = 0;
    let deltaX = 0;
    let deltaY = 0;
    let zIndexCounter = 0;
    
    let userNotes = JSON.parse(sessionStorage.getItem('notes')) || [];

    function Note (x, y, text) {
        this.posX = x;
        this.posY = y;
        this.noteText = text;
    }

   /*  let note1 = new Note(20, 20, 'fyghjkl');
    let note2 = new Note(520, 320, 'ugyhijk hihjk');
    userNotes.push(note1, note2,);
 */
    function createOneNoteMarkup(noteObj, index) {
        let noteArea = document.createElement('div');
        noteArea.classList.add('note');
        noteArea.style.top = `${noteObj.posY}px`;
        noteArea.style.left = `${noteObj.posX}px`;
        noteArea.append(`${noteObj.noteText}`);

        let deleteIcon = document.createElement('img');
        deleteIcon.setAttribute('src', 'assets/b394f1c0280879beb70bc51813fe1f41-recycle-bin-colored-stroke-icon-by-vexels.png');
        deleteIcon.classList.add('delete-note');
        noteArea.append(deleteIcon);

        deleteIcon.addEventListener('click', deleteNote);
        function deleteNote () {
            userNotes.splice(index, 1);
            updateMarkup();
        }
        
        noteArea.addEventListener('dblclick', editNote);
        function editNote () { 
            let editText = document.createElement('textarea');
            editText.setAttribute('rows', '8');
            editText.setAttribute('cols', '19');
            editText.setAttribute('maxlength', 150);
            noteArea.firstChild.replaceWith(editText);
            editText.value = noteObj.noteText;
            editText.setAttribute('autofocus', 'true');
            noteArea.classList.add('edited-note');

            board.addEventListener('click', stopEdit);
            function stopEdit (event) {
                if (event.target == board){
                noteObj.noteText = editText.value;
                noteArea.firstChild.replaceWith(`${noteObj.noteText}`);
                updateMarkup();
                }
        }
    }
           
        return noteArea;
    }

    function updateMarkup() {
        board.innerHTML = '';
        userNotes.forEach(function(item, index){
            let note = createOneNoteMarkup(item, index);
            note.onmousedown = function(e) {
                zIndexCounter++;
                dragNote = note;
                dragNote.style.zIndex = zIndexCounter;
                deltaX = e.pageX - dragNote.offsetLeft;
                deltaY = e.pageY - dragNote.offsetTop;
                document.addEventListener('mousemove', setNotePosition);
            }
            note.onmouseup = function(e) {
                document.removeEventListener('mousemove', setNotePosition);
                item.posX = dragNote.offsetLeft;
                item.posY = dragNote.offsetTop;
                sessionStorage.setItem('notes', JSON.stringify(userNotes));
            }
            board.append(note);
        })
        sessionStorage.setItem('notes', JSON.stringify(userNotes));
    }

    updateMarkup();

    function getRandomInteger (min, max) {
        return Math.random() * (max - min) + min;
    }

    addNote.onclick = function () {
        let newNote = new Note(getRandomInteger(0, 1400), getRandomInteger(0, 550), '');
        userNotes.push(newNote);
        updateMarkup();
    }

    function setNotePosition(e) {
        dragNote.style.top = `${e.pageY - deltaY}px`;
        dragNote.style.left = `${e.pageX - deltaX}px`;
    }

    

})