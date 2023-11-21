import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

import { fetchCatByBreed, fetchBreeds } from './js/cat-api';

const refs = {
	selectCat: document.querySelector('.breed-select'),
	loader: document.querySelector('.loader'),
	error: document.querySelector('.error'),
	catInfo: document.querySelector('.cat-info'),
};

function createOption(information) {
	const arrayOption = information
		.map(({ id, name }) => `<option value='${id}'>${name}</option>`)
		.join('');
	refs.selectCat.insertAdjacentHTML('beforeend', arrayOption);

	new SlimSelect({
		select: refs.selectCat,
	});
	refs.loader.style.display = 'none';
}

function createMarkup(breeds, url) {
	const { name, temperament, description } = breeds;

	const informationOfCat = `
	<img src="${url}" alt="${name}" width="600" />
	<div class="box-of-cat">
		<h2 class="header">${name}</h2>
		<p><b>Description:</b>${description}</p>
		<p class="temperament"><b>Temperament:</b> ${temperament}</p>
	</div>
	`;
	refs.catInfo.innerHTML = informationOfCat;
}

fetchBreeds()
	.then(data => createOption(data))
	.catch(() => {
		Notiflix.Notify.failure(refs.error.textContent);
		refs.error.style.display = 'block';
		refs.loader.style.display = 'block';
	});

function onChange(e) {
	refs.error.style.display = 'none';
	refs.loader.style.display = 'block';
	refs.catInfo.style.display = 'none';
	const targetId = e.target.value;

	fetchCatByBreed(targetId)
		.then(({ breeds, url }) => {
			createMarkup(breeds[0], url);
			refs.catInfo.style.display = 'flex';
			refs.catInfo.style.gap = '14px'		
			refs.loader.style.display = 'none';
		})
		.catch(() => {
			Notiflix.Notify.failure(refs.error.textContent);
			refs.error.style.display = 'block';
			refs.loader.style.display = 'none';
			
		});
}

refs.selectCat.addEventListener('change', onChange);
