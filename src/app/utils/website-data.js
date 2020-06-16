module.exports = {
    "URL": 'https://covid.saude.gov.br/',
    //"UPDATE_XPATH": '//div[contains(@class, "card-total")][2]/div[2]/b',
    "UPDATE_XPATH": '/html/body/app-root/ion-app/ion-router-outlet/app-home/ion-content/div[1]/div[1]/div[3]/span',
    //"DONWLOAD_BUTTON_XPATH": '//div[@class="ok"]',
    "DONWLOAD_BUTTON_XPATH": '/html/body/app-root/ion-app/ion-router-outlet/app-home/ion-content/div[1]/div[2]/ion-button',
    "DOCUMENT_HEADER_TEXT": {
        "UF": 'estado',
        "CONFIRMED": 'casosAcumulado',
        "DEATHS": 'obitosAcumulado',
    },
}
