
function fname(i) {
	const card = document.getElementById(`card-${i}`)
	if (card === undefined) {
		return
	}
	var name = card.textContent.toLowerCase()
	name = name.replace(/\s|,|\.|-|—|'|:|\(|\)|"|\/|!/g, "")
	name = name.replace(/ö|ó/g, "o") // Rötschreck, Dónal
	name = name.replace(/é|ë|è/g, "e") // Céleste, Gaël, Père
	name = name.replace(/œ/g, "oe") // Cœur
	name = name.replace(/ç/g, "c") // Monçada
	name = name.replace(/á|ã/g, "a") // Vásquez, João
	name = name.replace(/í|î/g, "i") // Día, Maître
	name = name.replace(/ñ/g, "n") // Montaña
	name = name.replace(/ü|ú/g, "u") // Powerbase: Zürich, Jesús
	name = name.replace(/™/g, "tm") // Pentex™
	return name
}
function dCi(i) {
	get_card_image(fname(i));
	var modal = document.getElementById("card-modal")
	for (const c of modal.classList) {
		if (c.startsWith("modal-card-")) {
			modal.classList.remove(c)
		}
	}
	modal.classList.add(`modal-card-${i}`)
	document.getElementById("card-prev").style.display = "block"
	document.getElementById("card-next").style.display = "block"
	modal.style.display = "block"
	modal.focus()
}
function cardIndex(modal) {
	for (const c of modal.classList) {
		if (c.startsWith("modal-card-")) {
			return parseInt(c.match(/[0-9]+/)[0])
		}
	}
}
function prevCard(event) {
	event.stopPropagation()
	dCi(cardIndex(event.target.parentElement) - 1)
}
function nextCard(event) {
	event.stopPropagation()
	dCi(cardIndex(event.target.parentElement) + 1)
}
function modalKeydown(event) {
	event.stopPropagation()
	event.preventDefault()
	// arrow DOWN
	if (event.keyCode === 40) {
		dCi(cardIndex(event.target) + 1)
		// arrow UP
	} else if (event.keyCode === 38) {
		dCi(cardIndex(event.target) - 1)
	}
}
function cardElement(element, i) {
	return `<li>${element.count} <span class="card" id="card-${i}" onclick="dCi(${i})" onmouseover="hC(fname(${i}))" onmouseout="oC()">${element.name}</span></li>`
}
function wrapText(text, maxlen) {
	if (!text) {
		return "(N/A)"
	}
	if (text.length > maxlen) {
		return text.substr(0, maxlen - 3) + "..."
	}
	return text
}
function removeComments() {
	var comments = document.getElementById("comments")
	if (comments) {
		comments.innerHTML = ""
	}
}
function displayDeck(data, deckname=undefined) {
	removeComments()
	document.getElementById("deck-name").textContent = wrapText(
		deckname || data.name || "(No Name)",
		25
	)
	header_lines = []
	if (data.player || data.author) {
		header_lines.push(wrapText(data.player || data.author, 40))
	}
	if (data.event) {
		header_lines.push(wrapText(data.event, 40))
	}
	if (data.place) {
		header_lines.push(wrapText(data.place, 40))
	}
	if (data.date) {
		header_lines.push(wrapText(data.date, 40))
	}
	if (data.players_count) {
		header_lines.push(wrapText(data.players_count, 32) + " players")
	}
	document.getElementById("deck-header").innerHTML = header_lines.join("<br/>")
	document.getElementById("crypt-header").textContent = `Commander`
	var cards = []
	data.command.cards.forEach((value, index) => {
		cards.push(cardElement(value, index))
	})
	document.getElementById("crypt-list").innerHTML = cards.join("\n")
	document.getElementById("library-header").textContent = `Library (${data.library.count})`
	var offset = cards.length
	var cards = new Array()
	for (const section of data.library.cards) {
		cards.push(
			`<li><h4>— ${section.type} (${section.count}) —</h4></li>`
		)
		section.cards.forEach((value, index) => {
			cards.push(cardElement(value, offset + index))
		})
		offset += section.cards.length
	}
	document.getElementById("library-list").innerHTML = cards.join("\n")
	document.getElementById("decklist").style.display = "block"
}
