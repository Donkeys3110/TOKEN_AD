// Инициализация TON Connect
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json',
    buttonRootId: 'connect-button-root'
});

// Обработчик изменения статуса подключения
tonConnectUI.onStatusChange(async (wallet) => {
    if (wallet) {
        try {
            // Получаем баланс и адрес кошелька
            const balanceElement = document.querySelector('.balance');
            const response = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${wallet.account.address}`);
            const data = await response.json();
            
            // Конвертируем баланс из нанотонов в TON
            const balance = data.result / 1000000000;
            balanceElement.textContent = `${balance.toFixed(2)} TON`;

            // Отправляем информацию на сервер
            await fetch('/api/wallet/connect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    address: wallet.account.address,
                    balance: balance
                })
            });
        } catch (error) {
            console.error('Ошибка при получении баланса:', error);
            document.querySelector('.balance').textContent = 'Ошибка получения баланса';
        }
    } else {
        document.querySelector('.balance').textContent = 'Кошелёк не подключен';
    }
});