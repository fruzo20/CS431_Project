#John Connors
#Dictator Game 
#October 12th 

import sys
import random as r 

class dictator:
    '''This is the role the computer plays to give a portion of money to Player 2'''

    def __init__(self):
        self.amount = r.randint(100, 1000) #amount of $$ dictator has 
        self.portion = r.randint(1, self.amount - 1) #portion of money the dictator will keep 
        # self.dict_points = player_points #The current amount of points the player has 
        self.given_away = 0

    def divide_money(self): 
        '''Dictator divides the money here'''

        # if self.portion >= self.amount: 
        #     print("You cannot give away that much")
        #     return
        # else: 
        p2_money = self.amount - self.portion #Subtracts the portion the dictator will give away from the amount the dictator has 
        self.given_away = p2_money
        return p2_money

    # def set_points(self): 
    #     '''Updates the amount of points the player has on the website'''
    #     self.player_points = self.player_points - self.amount
    
    # def gain_loss(self, acceptance): 
    #     '''If the player accepts the offer, the amount of points wagered are added to the existing points of the dicator. If 
    #     the player rejects the offer the dictator loses player_points.'''
        
    #     if acceptance == 0: 
    #         self.set_points()
    #     else:  
    #         self.amount = self.amount + (self.amount - self.given_away) #gives the dictator the points they got from the wager


class player_2: 
    '''This is the player who will accept or reject the dictator's offer'''

    def __init__(self, player_points, amount_recieved):
        self.player_points = player_points #current amount of player points this person has
        self.amount_recieved = amount_recieved
    
    def reject_or_accept(self, acceptance): 
        '''Player gets to decide whether to reject of accept the offer from the dictator'''

        a = 0 
        while a == 0:
            if acceptance == "no".lower().strip(): 
                a = 1
                print("You and the dictator get nothing")
                return 0 
            elif acceptance == "yes".lower().strip(): 
                a = 1
                new_points = self.amount_recieved + self.player_points
                print("You got " + str(new_points) + " points!")
                return new_points

    def update_points(self, points): 
        '''Updates the player's points'''

        if points != 0: 
            self.player_points = points
        else: 
            self.player_points = self.player_points

def main(): 
    d = dictator()
    p2_money = d.divide_money()
    print('{"p2_money":"' +  str(p2_money)+ '", "dictator_amount":"'+ str(d.amount) +'"}')

    # p2 = player_2(100, p2_money)

    # print("Do you accept? (yes or no)")
    # accept = input()
    # a = p2.reject_or_accept(accept.lower().strip())

    # p2.update_points(a)

    # if a == 0: 
    #     print("The dictator has " + str(d.amount - d.amount) + " " + "points!\nThe player has " + str(p2.player_points) + " " + "points!")  
    # elif a > 0: 
    #     print("The dictator has " + str(d.amount) + " " + "points!\nThe player has " + str(p2.player_points) + " " + "points!")  

main()