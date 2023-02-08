const modalClose = document.getElementById('close-modal');
const modalShow = document.getElementById('show-modal');
const modal = document.getElementById('modal');
const bookmarkForm =  document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

const showModal = () => {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

const closeModal = () => {
    modal.classList.remove('show-modal');
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', closeModal);
window.addEventListener('click', (e) => (e.target === modal)? closeModal() : false);

// Validate From 
const validate = (nameValue, urlValue) => {
    var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    if(!nameValue || !urlValue) {
        alert('Please submit values for both fields.');
        return false;
    }
    if(urlValue.match(regex)) {
        // Match
    } else {
        alert("Please provide a valid web address");
        return false;
    }
    return true;
}


// Fetch Bookmarks
const fetchBookmarks = () => {
    // Get bookmarks from localStorage if available
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // Create a bookmarks array in localStorage
        bookmarks = [
            {
                name: 'Example Web',
                url: 'https://example.com/'
            }
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Delete Bookmark
const deleteBookmark = (url) => {
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url = url) { 
            bookmarks.splice(i, 1);
        }
    });
    // Update bookmarks
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Build Bookmark DOM
const buildBookmarks = () => {
    // Build items;
    /* Template +>
    <div class="item">
        <i class="fas fa-times" title="Delete bookmark"></i>
        <div class="name">
            <img src="favicon.png" alt="">
            <a href="" target="_blank">ZTM</a>
        </div>
    </div> 
    */
   bookmarksContainer.innerHTML = "";
    bookmarks.forEach(bookmark => {
        const {name, url} = bookmark;
        // Item
        const item = document.createElement('div');
        item.classList.add('item');
        // Close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add("fas", "fa-times");
        closeIcon.setAttribute('title', "Delete bookmark");
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        // Favicon / Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // img
        const imageInfo = document.createElement('img');
        console.log(url);
        imageInfo.setAttribute('src', `https://www.google.com/s2/favicons?domain=${url}`);
        imageInfo.setAttribute('alt', 'Favicon');
        // a tag
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // console.log(link);
        // Append fav, link => name
        linkInfo.append(imageInfo, link);
        // Append to item
        item.append(closeIcon, linkInfo);
        // Complete
        bookmarksContainer.appendChild(item);
    });
}


// Handle data from form
const storeBookmark = (e) => {
    // e.preventDefault();
    const nameValue = websiteNameEl.value;  
    let urlValue = websiteUrlEl.value;

    if (!urlValue.includes("http://") && !urlValue.includes("https://")) {
        urlValue = `https://${urlValue}`;
    }
    if(!validate(nameValue, urlValue)) { 
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue
    }
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    bookmarkForm.reset();
    websiteNameEl.focus();
    fetchBookmarks();
}

// Form event listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On load => Fetch book mark
fetchBookmarks();