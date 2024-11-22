let cart = [];
let orderNumber = 1;

function toggleDetails(productCard) {
    const title = productCard.querySelector('.card-title').innerText;
    const price = productCard.querySelector('.card-text').innerText.replace('R$ ', '').replace(',', '.');
    const image = productCard.querySelector('img').src;

    // Tenta coletar a descrição, mas só se o elemento existir
    const descriptionElements = productCard.querySelectorAll('.card-title + h6');
    const description = Array.from(descriptionElements)
        .map(el => el.innerText) // Coleta o texto de cada `<h6>`
        .join(', '); // Junta com vírgulas, ou qualquer separador desejado

    document.getElementById('productTitle').innerText = title;
    document.getElementById('productPrice').innerText = `R$ ${price}`;
    document.getElementById('productImage').src = image;
    document.getElementById('productDescription').innerText = description || 'Sem descrição disponível.';


  

    // Resetar os campos de quantidade e observação ao abrir um novo produto
    document.getElementById('productQuantity').value = 1;
    document.getElementById('productObservation').value = '';

    document.getElementById('productDetailsPopup').classList.add('active');
}

function closePopup() {
    document.getElementById('productDetailsPopup').classList.remove('active');
}

function addToCart() {
    const title = document.getElementById('productTitle').innerText;
    const price = parseFloat(document.getElementById('productPrice').innerText.replace('R$ ', '').replace(',', '.'));
    const quantity = parseInt(document.getElementById('productQuantity').value);
    const observation = document.getElementById('productObservation').value;

    // Calcular o valor total do item
    const totalItemPrice = (price * quantity).toFixed(2);

    const cartItem = {
        title: title,
        price: price,
        quantity: quantity,
        observation: observation,
        totalPrice: parseFloat(totalItemPrice),
        image: document.getElementById('productImage').src,
        orderNumber: orderNumber
    };

    cart.push(cartItem);
    orderNumber++;
    updateCartNumber();
    closePopup();
    updateCartDetails(); // Atualizar os detalhes do carrinho
}


function togglePixInfo() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const pixInfo = document.getElementById('pixInfo');

    if (paymentMethod === 'pix') {
        pixInfo.style.display = 'block'; // Exibe a chave Pix
    } else {
        pixInfo.style.display = 'none'; // Oculta a chave Pix
    }
}

function copyPixKey() {
    const pixKey = document.getElementById('pixKey').innerText;
    navigator.clipboard.writeText(pixKey)
        .then(() => {
            alert('Chave Pix copiada para a área de transferência!');
        })
        .catch((error) => {
            alert('Erro ao copiar a chave Pix: ' + error);
        });
}

function finalizeOrder() {
    document.getElementById('finalizeOrderPopup').classList.add('active');
}

function closeFinalizeOrderPopup() {
    document.getElementById('finalizeOrderPopup').classList.remove('active');
}

document.addEventListener("DOMContentLoaded", function() {
    const enviarPedidoButton = document.getElementById('enviarPedido');
    enviarPedidoButton.removeEventListener('click', submitOrder);
    enviarPedidoButton.addEventListener('click', submitOrder);
});


function submitOrder(event) {
    event.preventDefault();

    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const paymentMethod = document.getElementById('paymentMethod').value;

    let items = '';
    let totalPrice = 0;

    cart.forEach(item => {
        const totalItemPrice = (item.price * item.quantity).toFixed(2);
        items += `- *Produto:* ${item.title}\n`;
        items += `  *Quantidade:* ${item.quantity}\n`;
        items += `  *Preço Unitário:* R$ ${item.price.toFixed(2)}\n`;
        items += `  *Subtotal:* R$ ${totalItemPrice}\n`;
        if (item.observation.trim() !== '') {
            items += `  *Observação:* ${item.observation}\n`;
        }
        items += `\n`; // Linha em branco entre os itens
        totalPrice += item.totalPrice;
    });

    const message = `
*PEDIDO DETALHADO:*
${items}
*TOTAL DO PEDIDO:* R$ ${totalPrice.toFixed(2)}

*DADOS DO CLIENTE:*
*Nome:* ${name || 'Não informado'}
*Telefone:* ${phone || 'Não informado'}

*FORMA DE PAGAMENTO:* ${paymentMethod.toUpperCase()}
`;

    // Codificar corretamente todos os caracteres
    const encodedMessage = encodeURIComponent(message);

    // Criar o link do WhatsApp com a mensagem codificada
    const whatsappUrl = `https://wa.me/5513981701696?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    cart = [];
    updateCartNumber();
    closeCart();
    closeFinalizeOrderPopup();
}





function updateCartNumber() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-number').innerText = totalItems;
}

function updateCartDetails() {
    let cartHtml = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        cartHtml = '<p>Carrinho vazio.</p>';
    } else {
        cart.forEach(item => {
            const totalItemPrice = (item.price * item.quantity).toFixed(2);
            cartHtml += `
                <div class="d-flex justify-content-between">
                    <p>${item.quantity} x ${item.title}</p>
                    <p>R$ ${totalItemPrice}</p>
                    <button class="btn btn-danger" onclick="removeItemFromCart(${item.orderNumber})">X</button>
                </div>
                <p>Observação: ${item.observation}</p>
                <hr>
            `;
            totalPrice += item.totalPrice;
        });
    }

    document.getElementById('cartItems').innerHTML = cartHtml;
    document.getElementById('cartTotal').innerHTML = `Total: R$ ${totalPrice.toFixed(2)}`;
}

function removeItemFromCart(orderNumber) {
    cart = cart.filter(item => item.orderNumber !== orderNumber);
    updateCartNumber();
    updateCartDetails();
}

function toggleCart() {
    document.getElementById('cartDetailsPopup').classList.toggle('active');
}

function closeCart() {
    document.getElementById('cartDetailsPopup').classList.remove('active');
}

document.getElementById('enviarPedido').addEventListener('click', function() {
    var nome = document.getElementById('nome').value;
    var telefone = document.getElementById('telefone').value;
    var itensPedido = cart.map(item => `${item.title} (${item.quantity} x R$ ${item.price.toFixed(2)})`).join(', '); 
    var precoTotal = cart.reduce((total, item) => total + item.totalPrice, 0).toFixed(2); 
    
    var mensagem = `PEDIDO ${nome}\n${itensPedido}\nPreço Total: R$ ${precoTotal}\nNome: ${nome}\nTelefone: ${telefone}`;
    var mensagemCodificada = encodeURIComponent(mensagem);
    var url = `https://wa.me/5513981701696?text=${mensagemCodificada}`;
    
    window.open(url, '_blank');
});