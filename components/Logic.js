export function divMoney(){
    const dict_money = 100; 
    const offer_money = Math.floor(Math.random()*(dict_money - 1) + 1); 

    return [offer_money, dict_money]; 
}