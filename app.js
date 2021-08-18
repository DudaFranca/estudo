const vm = new Vue({
  el: "#app",
  data: {
      produtos: [],
      produto: false,
      carrinho: [],
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
    adicionarItem() {
      this.produto.estoque--;
      // Disistruturando o objeto produto: coloca const { nome das variaveis que serão utilizadas } = this.objeto
      const { id, nome, preco } = this.produto;
      // Adicionando no array carrinho
      this.carrinho.push({ id, nome, preco });
    },
    removerItem(index) {
      // Remove 1 item do carrinho.
      this.carrinho.splice(index, 1);
    }
  },
  created() {
      this.fetchProdutos();
  }
})