const vm = new Vue({
  el: "#app",
  data: {
      produtos: [],
      produto: false,
      carrinho: [],
      carrinhoAtivo: false,
      mensagemAlerta: "",
      alertaAtivo: false,
  },
  filters: {
    numeroPreco(valor) {
      return valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
    }
  },
  computed: {
    // Função que calcula o valor total do carrinho
    carrinhoTotal() {
      let total = 0;
      // Verifica se existe item no carrinho
      if(this.carrinho.length) {
        // item é nome, id e preço de cada produto no carrinho
        this.carrinho.forEach(item => {
          total += item.preco;
        });
      }
      return total;
    }
  },
  methods: {
    fetchProdutos() {
      fetch("./api/produtos.json")
        .then(r => r.json())
        .then(r => {
            this.produtos = r;
        })
    },
    fetchProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`)
        .then(r => r.json())
        .then(r => {
          this.produto = r;
        })
    },
    abrirModal(id) {
      this.fetchProduto(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    },
    fecharModal({target, currentTarget}) {
      if(target === currentTarget) {
        this.produto = false
      }
    },
    clickForaCarrinho({target, currentTarget}) {
      if(target === currentTarget) this.carrinhoAtivo = false;
    },
    adicionarItem() {
      this.produto.estoque--;
      // Disistruturando o objeto produto: coloca const { nome das variaveis que serão utilizadas } = this.objeto
      const { id, nome, preco } = this.produto;
      // Adicionando no array carrinho
      this.carrinho.push({ id, nome, preco });
      // Altera o texto do alerta
      this.alerta(`${nome} adicionado ao carrinho`);
    },
    removerItem(index) {
      // Remove 1 item do carrinho.
      this.carrinho.splice(index, 1);
    },
    checarLocalStorage() {
      if(window.localStorage.carrinho) {
        // JSON.parse = Transforma a string devolta em array
        this.carrinho = JSON.parse(window.localStorage.carrinho);
      }
    },
    alerta(mensagem) {
      // Muda o mensagemAlerta para mensagem
      this.mensagemAlerta = mensagem;
      this.alertaAtivo = true;
      setTimeout(() => {
        this.alertaAtivo = false;
      }, 1500)
    },
    // Pega o hash (produto selecionado) coloca no fetchProduto e troca a # por vazio, assim é possivel abrir o modal em outra aba
    router() {
      const hash = document.location.hash;
      if(hash) {
        this.fetchProduto(hash.replace("#", ""));
      }
    }
  },
  // Olha (é ativada) sempre que acontece algo com o carrinho
  watch: {
    produto() {
      // Troca o titulo para o nome do produto, são não existir muda para Techno
      document.title = this.produto.nome || "Techno";
      // Muda a URL. Adiciona no final o id do produto ou deixa vazio
      const hash = this.produto.id || "";
      history.pushState(null, null, `#${hash}`)
    },
    carrinho() {
      // Salva no browser o que é adicionado no carrinho. JSON.stringify = transforma o array em string
      window.localStorage.carrinho = JSON.stringify(this.carrinho);
    }
  },
  // Ativado sempre que o VUE é criado
  created() {
      this.fetchProdutos();
      this.checarLocalStorage();
      this.router();
  }
})