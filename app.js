class Despesa {

	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for (let i in this) {

			if (this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}

		return true
	}

}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if (id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')

		return parseInt(proximoId) + 1
	}

	gravar(despesa) {
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(despesa))

		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros() {
		// array de despesas
		let despesas = Array()
		let id = localStorage.getItem('id')

		// recuperar todas as despesas cadastradas em localStorage
		for (let i = 1; i <= id; i++) {
			// recuperar a despesa
			let despesa = JSON.parse(localStorage.getItem(i))

			// existe a possibilidade de haver índices que foram pulados/removidos
			// nestes casos nós vamos pular esses índices
			if (despesa === null) {
				continue
			}

			despesa.id = i
			despesas.push(despesa)
		}

		return despesas
	}

	pesquisar(despesa) {
		let despesasFiltradas = Array()

		despesasFiltradas = this.recuperarTodosRegistros()

		console.log(despesa)

		// ano
		if (despesa.ano != '') {
			console.log('Filtro de ano')
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}

		// mes
		if (despesa.mes != '') {
			console.log('Filtro de mês')
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}

		// dia
		if (despesa.dia != '') {
			console.log('Filtro de dia')
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}

		// tipo
		if (despesa.tipo != '') {
			console.log('Filtro de tipo')
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}

		// descricao
		if (despesa.descricao != '') {
			console.log('Filtro de descricao')
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}

		// valor
		if (despesa.valor != '') {
			console.log('Filtro de valor')
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		return despesasFiltradas
	}

	remover(id) {
		localStorage.removeItem(id)
	}

}

let bd = new Bd()

function cadastrarDespesa() {
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value,
		valor.value)

	if (despesa.validarDados()) {
		bd.gravar(despesa)

		document.getElementById('modalRegistraDespesaTitulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modalRegistraDespesaTitulo').className = 'modal-title text-success'
		document.getElementById('modalRegistraDespesaDescricao').innerHTML = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('modalRegistraDespesaBotao').innerHTML = 'Voltar'
		document.getElementById('modalRegistraDespesaBotao').className = 'btn btn-success'

		// dialog de sucesso
		$('#modalRegistraDespesa').modal('show')

		// limpando os campos após incluir registro no BD
		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''
	} else {
		document.getElementById('modalRegistraDespesaTitulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modalRegistraDespesaTitulo').className = 'modal-title text-danger'
		document.getElementById('modalRegistraDespesaDescricao').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
		document.getElementById('modalRegistraDespesaBotao').innerHTML = 'Voltar e corrigir'
		document.getElementById('modalRegistraDespesaBotao').className = 'btn btn-danger'

		// dialog de erro
		$('#modalRegistraDespesa').modal('show')
	}
}

function carregaListaDespesas(despesas = Array(), filtro = false) {
	if (despesas.length == 0 && filtro == false) {
		despesas = bd.recuperarTodosRegistros()
	}

	// selecionando o elemento tbody da tabela
	let listaDespesas = document.getElementById('listaDespesas')
	listaDespesas.innerHTML = ''

	/*
		<tr>
			0 = <td></td>
			1 = <td></td>
			2 = <td></td>
			3 = <td></td>
		</tr>
	*/

	// percorrer o array despesas, listando cada despesa de forma dinâmica
	despesas.forEach(function (despesa) {
		// criando a linha (tr)
		let linha = listaDespesas.insertRow()

		// criar as colunas (td)
		linha.insertCell(0).innerHTML = `${despesa.dia}/${despesa.mes}/${despesa.ano}`

		// ajustar o tipo
		switch (parseInt(despesa.tipo)) {
			case 1:
				despesa.tipo = 'Alimentação'
				break
			case 2:
				despesa.tipo = 'Educação'
				break
			case 3:
				despesa.tipo = 'Lazer'
				break
			case 4:
				despesa.tipo = 'Saúde'
				break
			case 5:
				despesa.tipo = 'Transporte'
				break
		}

		linha.insertCell(1).innerHTML = despesa.tipo
		linha.insertCell(2).innerHTML = despesa.descricao
		linha.insertCell(3).innerHTML = despesa.valor

		// criar o botão de exclusão
		let botao = document.createElement('btn')
		botao.className = 'btn btn-danger'
		botao.innerHTML = '<i class="fas fa-times"></i>'
		botao.id = `idDespesa${despesa.id}`
		botao.onclick = function () {
			// remover a despesa
			let id = this.id.replace('idDespesa', '')

			bd.remover(id)

			$('#modalRemoveDespesa').modal('show')
		}

		linha.insertCell(4).append(botao)
	})
}

function pesquisarDespesa() {
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
	let despesas = bd.pesquisar(despesa)

	carregaListaDespesas(despesas, true)
}