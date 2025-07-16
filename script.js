// --- Referencias a Elementos HTML ---
const btnPeliculas = document.getElementById('btnPeliculas');
const btnSeries = document.getElementById('btnSeries');
const peliculasSection = document.getElementById('peliculas-section');
const seriesSection = document.getElementById('series-section');
const peliculasList = document.getElementById('peliculas-list');
const seriesList = document.getElementById('series-list');

// Referencias a elementos del modal de AÑADIR
const addItemModal = document.getElementById('add-item-modal');
const closeButton = document.querySelector('.close-button'); // Botón de cerrar del modal de añadir
const modalTitle = document.getElementById('modal-title');
const itemTypeInput = document.getElementById('item-type');
const itemForm = document.getElementById('item-form');
const btnAddPelicula = document.getElementById('btnAddPelicula');
const btnAddSerie = document.getElementById('btnAddSerie');
const messageContainer = document.getElementById('message-container');
const itemNotesInput = document.getElementById('item-notes'); // ¡CORRECCIÓN: Esta línea faltaba!


// Campos de progreso en el modal de AÑADIR (no se usan para introducir progreso directamente al añadir)
const progressFields = document.getElementById('progress-fields');
const itemSeasonInput = document.getElementById('item-season');
const itemEpisodeInput = document.getElementById('item-episode');
const itemMinuteInput = document.getElementById('item-minute');
const labelSeason = document.getElementById('label-season');
const labelEpisode = document.getElementById('label-episode');
const labelMinute = document.getElementById('label-minute');

// Referencias a elementos del MODAL DE EDICIÓN
const editItemModal = document.getElementById('edit-item-modal');
const editCloseButton = document.querySelector('.edit-close-button'); // Botón de cerrar del modal de edición
const editModalTitle = document.getElementById('edit-modal-title');
const editItemIdInput = document.getElementById('edit-item-id');
const editItemTypeInput = document.getElementById('edit-item-type');
const editItemForm = document.getElementById('edit-item-form');

const editItemTitleInput = document.getElementById('edit-item-title');
const editItemPlatformInput = document.getElementById('edit-item-platform');
const editItemImageUrlInput = document.getElementById('edit-item-image-url');
const editItemStatusSelect = document.getElementById('edit-item-status-select');
const editItemNotesInput = document.getElementById('edit-item-notes');

const editProgressFields = document.getElementById('edit-progress-fields');
const editItemSeasonInput = document.getElementById('edit-item-season');
const editItemEpisodeInput = document.getElementById('edit-item-episode');
const editItemMinuteInput = document.getElementById('edit-item-minute');
const editLabelSeason = document.getElementById('edit-label-season');
const editLabelEpisode = document.getElementById('edit-label-episode');
const editLabelMinute = document.getElementById('edit-label-minute');


// --- Variables para Datos (usaremos LocalStorage) ---
let peliculas = JSON.parse(localStorage.getItem('peliculas')) || [];
let series = JSON.parse(localStorage.getItem('series')) || [];

// Variables para el filtro actual
let currentPeliculasFilter = 'quiero-ver'; // Por defecto, mostrar "Quiero Ver"
let currentSeriesFilter = 'quiero-ver';   // Por defecto, mostrar "Quiero Ver"

// --- Funciones de Utilidad ---

function saveData() {
    localStorage.setItem('peliculas', JSON.stringify(peliculas));
    localStorage.setItem('series', JSON.stringify(series));
    console.log("Datos guardados en LocalStorage.");
}

function showMessage(msg, type = 'success', duration = 3000) {
    messageContainer.innerHTML = `<div class="message ${type}">${msg}</div>`;
    setTimeout(() => {
        messageContainer.innerHTML = '';
    }, duration);
}

// Función auxiliar para controlar la visibilidad de los campos de progreso
// 'isEditModal' para diferenciar si estamos en el modal de añadir o de edición
function updateProgressFieldsVisibility(type, status, isEditModal) {
    const fieldsContainer = isEditModal ? editProgressFields : progressFields;
    const seasonLabel = isEditModal ? editLabelSeason : labelSeason;
    const episodeLabel = isEditModal ? editLabelEpisode : labelEpisode;
    const minuteLabel = isEditModal ? editLabelMinute : labelMinute;
    const seasonInput = isEditModal ? editItemSeasonInput : itemSeasonInput;
    const episodeInput = isEditModal ? editItemEpisodeInput : itemEpisodeInput;
    const minuteInput = isEditModal ? editItemMinuteInput : itemMinuteInput;

    if (status === 'viendo') {
        fieldsContainer.classList.remove('hidden');
        if (type === 'serie') {
            seasonLabel.style.display = 'block';
            seasonInput.style.display = 'block';
            episodeLabel.style.display = 'block';
            episodeInput.style.display = 'block';
            minuteLabel.style.display = 'none';
            minuteInput.style.display = 'none';
        } else { // pelicula
            seasonLabel.style.display = 'none';
            seasonInput.style.display = 'none';
            episodeLabel.style.display = 'none';
            episodeInput.style.display = 'none';
            minuteLabel.style.display = 'block';
            minuteInput.style.display = 'block';
        }
    } else {
        fieldsContainer.classList.add('hidden');
    }
}

// Función para mostrar una sección y ocultar la otra
function showSection(sectionToShow, sectionToHide, activeButton, inactiveButton) {
    sectionToShow.classList.remove('hidden');
    sectionToHide.classList.add('hidden');
    activeButton.classList.add('active');
    inactiveButton.classList.remove('active');

    // Resetear botones de filtro y activar "Quiero Ver" al cambiar de sección
    if (sectionToShow.id === 'peliculas-section') {
        currentPeliculasFilter = 'quiero-ver';
        document.querySelectorAll('#peliculas-section .tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelector('#peliculas-section .tab-button[data-status="quiero-ver"]').classList.add('active');
    } else if (sectionToShow.id === 'series-section') {
        currentSeriesFilter = 'quiero-ver';
        document.querySelectorAll('#series-section .tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelector('#series-section .tab-button[data-status="quiero-ver"]').classList.add('active');
    }
    renderItems(); // Vuelve a renderizar los elementos con el filtro predeterminado
}

// Función para abrir el modal de AÑADIR
function openAddModal(type) {
    modalTitle.textContent = `Añadir Nueva ${type === 'pelicula' ? 'Película' : 'Serie'}`;
    itemTypeInput.value = type;

    // Ocultar siempre los campos de progreso en el modal de añadir inicialmente
    // Estos campos no se usan para introducir progreso al añadir, solo en el modal de edición
    progressFields.classList.add('hidden');
    itemSeasonInput.value = 1; // Valores por defecto
    itemEpisodeInput.value = 1;
    itemMinuteInput.value = 0;

    itemNotesInput.value = ''; // Limpiar notas para evitar "Añadir notas..." persistente
    itemNotesInput.classList.remove('placeholder-text'); // Quitar clase de placeholder

    addItemModal.classList.add('active'); // Muestra el modal
}

// Función para cerrar el modal de AÑADIR
function closeAddModal() {
    addItemModal.classList.remove('active');
    itemForm.reset();
    progressFields.classList.add('hidden'); // Asegura que los campos de progreso estén ocultos al cerrar
}

// Función para abrir el modal de EDICIÓN
function openEditModal(item) {
    editModalTitle.textContent = `Editar ${item.type === 'pelicula' ? 'Película' : 'Serie'}`;
    editItemIdInput.value = item.id;
    editItemTypeInput.value = item.type;

    // Rellenar campos con la información actual del elemento
    editItemTitleInput.value = item.title;
    editItemPlatformInput.value = item.platform || '';
    editItemImageUrlInput.value = item.imageUrl || '';
    editItemStatusSelect.value = item.status;
    editItemNotesInput.value = item.notes || '';

    // Limpiar clase de placeholder en notas si hay contenido
    if (editItemNotesInput.value !== '' && editItemNotesInput.value !== 'Añadir notas...') {
        editItemNotesInput.classList.remove('placeholder-text');
    } else {
        editItemNotesInput.classList.add('placeholder-text');
        editItemNotesInput.value = 'Añadir notas...';
    }


    // Mostrar u ocultar campos de progreso en el modal de edición
    updateProgressFieldsVisibility(item.type, item.status, true); // true para el modal de edición

    // Rellenar campos de progreso si existen
    editItemSeasonInput.value = item.season || 1;
    editItemEpisodeInput.value = item.episode || 1;
    editItemMinuteInput.value = item.minute || 0;

    editItemModal.classList.add('active'); // Mostrar el modal
}

// Función para cerrar el modal de EDICIÓN
function closeEditModal() {
    editItemModal.classList.remove('active');
    editItemForm.reset();
    editProgressFields.classList.add('hidden'); // Ocultar campos de progreso al cerrar
}


// --- Funciones para Manipular Datos ---

function changeItemStatus(id, newStatus, type) {
    let list;
    if (type === 'pelicula') {
        list = peliculas;
    } else {
        list = series;
    }

    const itemIndex = list.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        list[itemIndex].status = newStatus;
        // Reiniciar progreso si el estado no es 'viendo'
        if (newStatus !== 'viendo') {
            list[itemIndex].season = null;
            list[itemIndex].episode = null;
            list[itemIndex].minute = null;
        } else {
            // Si el estado es 'viendo', asegúrate de que los valores sean por defecto si son null
            if (type === 'pelicula' && list[itemIndex].minute === null) {
                list[itemIndex].minute = 0;
            } else if (type === 'serie') {
                if (list[itemIndex].season === null) list[itemIndex].season = 1;
                if (list[itemIndex].episode === null) list[itemIndex].episode = 1;
            }
        }
        saveData();
        renderItems(); // Renderizar de nuevo para que los campos editables aparezcan/desaparezcan
        showMessage(`Estado de "${list[itemIndex].title}" cambiado a "${newStatus === 'quiero-ver' ? 'Quiero Ver' : newStatus === 'viendo' ? 'Viendo Ahora' : 'Ya Vista'}"`, 'success');
    }
}

function deleteItem(id, type) {
    if (type === 'pelicula') {
        peliculas = peliculas.filter(item => item.id !== id);
    } else {
        series = series.filter(item => item.id !== id);
    }

    saveData();
    renderItems();
    showMessage(`¡Elemento eliminado!`, 'error');
}

// --- Funciones de Renderizado (Mostrar Elementos en la Página) ---

function createItemCard(item) {
    const card = document.createElement('div');
    card.classList.add('item-card');
    card.classList.add(`status-${item.status}`);

    let imageHtml = '';
    if (item.imageUrl) {
        imageHtml = `<img src="${item.imageUrl}" alt="${item.title}" class="item-image">`;
    } else {
        imageHtml = `<div class="item-no-image">No Image</div>`;
    }

    const getStatusButtonClass = (buttonStatus) => item.status === buttonStatus ? 'active' : '';

    // Campos de progreso editables en línea (Temporada/Episodio/Minuto)
    let progressHtml = '';
    if (item.status === 'viendo') {
        if (item.type === 'pelicula') {
            progressHtml = `
                <p class="item-progress">Viendo desde el minuto:
                    <span class="editable-field" data-field="minute" contenteditable="true">${item.minute !== null ? item.minute : 0}</span>
                </p>`;
        } else if (item.type === 'serie') {
            progressHtml = `
                <p class="item-progress">T:
                    <span class="editable-field" data-field="season" contenteditable="true">${item.season !== null ? item.season : 1}</span> E:
                    <span class="editable-field" data-field="episode" contenteditable="true">${item.episode !== null ? item.episode : 1}</span>
                </p>`;
        }
    }

    // Notas editables en línea
    const notesContent = item.notes || 'Añadir notas...';
    const notesClass = item.notes ? 'item-notes editable-field' : 'item-notes editable-field placeholder-text';

    card.innerHTML = `
        ${imageHtml}
        <div class="item-info">
            <h3>${item.title}</h3>
            <p>Plataforma: ${item.platform || 'N/A'}</p>
            <p class="item-status">Estado: <span>${item.status === 'quiero-ver' ? 'Quiero Ver' : item.status === 'viendo' ? 'Viendo Ahora' : 'Ya Vista'}</span></p>
            ${progressHtml}
            <p class="${notesClass}" data-field="notes" contenteditable="true">${notesContent}</p>
            <div class="card-actions">
                <button class="status-btn ${getStatusButtonClass('quiero-ver')}" data-id="${item.id}" data-status-change="quiero-ver">Quiero Ver</button>
                <button class="status-btn ${getStatusButtonClass('viendo')}" data-id="${item.id}" data-status-change="viendo">Viendo</button>
                <button class="status-btn ${getStatusButtonClass('vista')}" data-id="${item.id}" data-status-change="vista">Vista</button>
            </div>
            <button class="edit-btn" data-id="${item.id}">Editar Detalle</button>
            <button class="delete-btn" data-id="${item.id}">Eliminar</button>
        </div>
    `;

    // --- Lógica para los botones y campos editables de la tarjeta ---
    card.querySelectorAll('.status-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.dataset.id);
            const newStatus = e.target.dataset.statusChange;
            const itemType = item.type;
            changeItemStatus(itemId, newStatus, itemType);
        });
    });

    card.querySelector('.edit-btn').addEventListener('click', () => {
        const itemToEdit = item.type === 'pelicula' ? peliculas.find(p => p.id === item.id) : series.find(s => s.id === item.id);
        if (itemToEdit) {
            openEditModal(itemToEdit);
        }
    });

    card.querySelector('.delete-btn').addEventListener('click', (e) => {
        const itemId = parseInt(e.target.dataset.id);
        const itemType = item.type;
        deleteItem(itemId, itemType);
    });

    // NUEVA LÓGICA: Event listeners para la edición en línea
    card.querySelectorAll('.editable-field').forEach(field => {
        // Eliminar texto de placeholder al enfocar
        field.addEventListener('focus', function() {
            if (this.classList.contains('placeholder-text')) {
                this.textContent = '';
                this.classList.remove('placeholder-text');
            }
        });

        // Guardar cambios cuando el campo pierde el foco (blur) o se presiona Enter
        field.addEventListener('blur', (e) => {
            const itemId = item.id;
            const itemType = item.type;
            const fieldName = e.target.dataset.field; // 'minute', 'season', 'episode', 'notes'
            let newValue = e.target.textContent.trim();

            // Validar y convertir a número si es un campo numérico
            if (fieldName === 'minute' || fieldName === 'season' || fieldName === 'episode') {
                newValue = parseInt(newValue) || (fieldName === 'minute' ? 0 : 1); // 0 para minuto, 1 para temporada/episodio
                if (newValue < 0) newValue = (fieldName === 'minute' ? 0 : 1); // Asegurar que no sea negativo
                e.target.textContent = newValue; // Actualizar el contenido visible con el valor validado
            }

            // Restaurar placeholder si está vacío
            if (fieldName === 'notes' && newValue === '') {
                e.target.textContent = 'Añadir notas...';
                e.target.classList.add('placeholder-text');
            }


            // Actualizar el objeto en el array y guardar
            let list = itemType === 'pelicula' ? peliculas : series;
            const itemToUpdate = list.find(it => it.id === itemId);

            if (itemToUpdate) {
                itemToUpdate[fieldName] = newValue; // Actualiza la propiedad específica
                saveData();
                showMessage('Cambios guardados en la tarjeta.', 'success', 1500);
            }
        });

        // Permitir guardar con Enter (y prevenir salto de línea en contenteditable)
        field.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Evita el salto de línea
                this.blur(); // Simula la pérdida de foco para activar el 'blur' y guardar
            }
        });
    });

    return card;
}

function renderItems() {
    // --- Renderizar Películas ---
    peliculasList.innerHTML = '';
    let filteredPeliculas = peliculas;
    if (currentPeliculasFilter !== 'all') {
        filteredPeliculas = peliculas.filter(item => item.status === currentPeliculasFilter);
    }
    filteredPeliculas.sort((a, b) => a.title.localeCompare(b.title));

    if (filteredPeliculas.length === 0) {
        peliculasList.innerHTML = '<p>No hay películas para mostrar con este filtro. ¡Añade la primera!</p>';
    } else {
        filteredPeliculas.forEach(pelicula => {
            const card = createItemCard(pelicula);
            peliculasList.appendChild(card);
        });
    }

    // --- Renderizar Series ---
    seriesList.innerHTML = '';
    let filteredSeries = series;
    if (currentSeriesFilter !== 'all') {
        filteredSeries = series.filter(item => item.status === currentSeriesFilter);
    }
    filteredSeries.sort((a, b) => a.title.localeCompare(b.title));

    if (filteredSeries.length === 0) {
        seriesList.innerHTML = '<p>No hay series para mostrar con este filtro. ¡Añade la primera!</p>';
    } else {
        series.forEach(serie => {
            const card = createItemCard(serie);
            seriesList.appendChild(card);
        });
    }

    console.log("Elementos renderizados con filtros aplicados.");
}

// --- Event Listeners ---

// Navegación entre secciones principales
btnPeliculas.addEventListener('click', () => {
    showSection(peliculasSection, seriesSection, btnPeliculas, btnSeries);
});

btnSeries.addEventListener('click', () => {
    showSection(seriesSection, peliculasSection, btnSeries, btnPeliculas);
});

// Botones de "Añadir"
btnAddPelicula.addEventListener('click', () => openAddModal('pelicula'));
btnAddSerie.addEventListener('click', () => openAddModal('serie'));

// Cierre del modal de AÑADIR
closeButton.addEventListener('click', closeAddModal);
addItemModal.addEventListener('click', (event) => {
    if (event.target === addItemModal) {
        closeAddModal();
    }
});

// Cierre del modal de EDICIÓN
editCloseButton.addEventListener('click', closeEditModal);
editItemModal.addEventListener('click', (event) => {
    if (event.target === editItemModal) {
        closeEditModal();
    }
});

// Envío del formulario de AÑADIR
itemForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const type = itemTypeInput.value;
    const title = document.getElementById('item-title').value;
    const platform = document.getElementById('item-platform').value;
    const imageUrl = document.getElementById('item-image-url').value;
    const notes = document.getElementById('item-notes').value;

    // Al añadir, el estado por defecto es 'quiero-ver', y el progreso es nulo.
    // El progreso y las notas se gestionan principalmente al editar en línea o en el modal de edición.
    const newItem = {
        id: Date.now(),
        title,
        platform,
        imageUrl,
        notes: notes.trim() === '' ? null : notes.trim(), // Guarda null si las notas están vacías
        status: 'quiero-ver', // Estado inicial por defecto al añadir
        type: type,
        season: null,
        episode: null,
        minute: null
    };

    if (type === 'pelicula') {
        peliculas.push(newItem);
    } else {
        series.push(newItem);
    }

    saveData();
    renderItems();
    closeAddModal();
    showMessage(`¡"${title}" añadida correctamente!`, 'success');
});

// Envío del formulario de EDICIÓN
editItemForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const id = parseInt(editItemIdInput.value);
    const type = editItemTypeInput.value;
    const newTitle = editItemTitleInput.value;
    const newPlatform = editItemPlatformInput.value;
    const newImageUrl = editItemImageUrlInput.value;
    const newStatus = editItemStatusSelect.value;
    const newNotes = editItemNotesInput.value;

    let list = type === 'pelicula' ? peliculas : series;
    const itemIndex = list.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        list[itemIndex].title = newTitle;
        list[itemIndex].platform = newPlatform;
        list[itemIndex].imageUrl = newImageUrl;
        list[itemIndex].status = newStatus;
        list[itemIndex].notes = newNotes.trim() === '' ? null : newNotes.trim(); // Guarda null si las notas están vacías

        // Actualizar campos de progreso solo si el estado es 'viendo'
        if (newStatus === 'viendo') {
            if (type === 'pelicula') {
                list[itemIndex].minute = parseInt(editItemMinuteInput.value);
                list[itemIndex].season = null;
                list[itemIndex].episode = null;
            } else { // series
                list[itemIndex].season = parseInt(editItemSeasonInput.value);
                list[itemIndex].episode = parseInt(editItemEpisodeInput.value);
                list[itemIndex].minute = null;
            }
        } else {
            // Si el estado no es 'viendo', limpiar los campos de progreso
            list[itemIndex].season = null;
            list[itemIndex].episode = null;
            list[itemIndex].minute = null;
        }

        saveData();
        renderItems();
        closeEditModal();
        showMessage(`"${newTitle}" actualizada correctamente.`, 'success');
    }
});

// Listener para el cambio de estado en el selector del modal de EDICIÓN
// Controla la visibilidad de los campos de progreso
editItemStatusSelect.addEventListener('change', () => {
    const type = editItemTypeInput.value;
    const status = editItemStatusSelect.value;
    updateProgressFieldsVisibility(type, status, true); // true para el modal de edición
});

// Event Listeners para Filtrado
document.querySelectorAll('.filter-tabs .tab-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const sectionId = e.target.closest('.content-section').id;
        const newFilter = e.target.dataset.status;

        if (sectionId === 'peliculas-section') {
            currentPeliculasFilter = newFilter;
            document.querySelectorAll('#peliculas-section .tab-button').forEach(btn => btn.classList.remove('active'));
        } else if (sectionId === 'series-section') {
            currentSeriesFilter = newFilter;
            document.querySelectorAll('#series-section .tab-button').forEach(btn => btn.classList.remove('active'));
        }
        e.target.classList.add('active');
        renderItems();
    });
});


// --- Inicialización al cargar la página ---
document.addEventListener('DOMContentLoaded', () => {
    // Renderiza los elementos al cargar la página por primera vez
    renderItems();
    // Asegura que los botones de filtro "Quiero Ver" estén activos al cargar
    document.querySelector('#peliculas-section .tab-button[data-status="quiero-ver"]').classList.add('active');
    document.querySelector('#series-section .tab-button[data-status="quiero-ver"]').classList.add('active');
});
