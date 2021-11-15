class Square():
    def __init__(self, width, height):
	    self.Width = width
	    self.Height = height

    def GetSquare(self):
	    return self.Height*self.Width

class Materials():
    def __init__(self, name):
        self.Name = name
        
    def GetMaterial(self):
        print("Ваш материал: ", self.Name)
    
class CostMaterial(Square):
    def __init__(self, width, height, cost):
	    super().__init__(width, height)
	    self.Cost = cost

    def GetCostMaterial(self):
        square = super().GetSquare()
        print("Общая стоимость: ", square*self.Cost)


a = Square(10, 15)
print("Площадь: ", a.GetSquare())

m = Materials("Плитка")
m.GetMaterial()

c = CostMaterial(a.Width, a.Height, 200)
c.GetCostMaterial()