const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json',
    buttonRootId: 'connect-button-root'
});

// Функция обновления баланса
async function updateBalance(address) {
    try {
        // Пример запроса к API для получения баланса.
        // Замените URL и логику обработки ответа в соответствии с выбранным API TON.
        const response = await fetch(`https://tonapi.io/v1/address/${address}/balance`);
        const data = await response.json();
        // Предполагаем, что баланс находится в поле balance (проверьте формат ответа)
        document.querySelector('.balance').innerText = `Баланс: ${data.balance}`;
    } catch (error) {
        console.error('Ошибка получения баланса:', error);
        document.querySelector('.balance').innerText = 'Ошибка получения баланса';
    }
}

// Обработчик изменений статуса подключения
tonConnectUI.onStatusChange((status) => {
    console.log(status);
    if (status.wallet) {
        const address = status.wallet.address;
        updateBalance(address);
    }
});