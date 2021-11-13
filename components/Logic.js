export function divMoney(){
    const dict_money = Math.floor((Math.random()*1001) + 1); 
    const offer_money = Math.floor(Math.random()*(dict_money - 1) + 1); 

    return [offer_money, dict_money]; 
}