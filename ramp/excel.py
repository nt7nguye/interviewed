"""
26 x 100 grid.

A1 + B1 -> simple parsing
"""


class Grid:
    def __init__(self):
        self.grid = [[0 for _ in range(100)] for _ in range(26)]

    def _convert_pos(self, pos):
        return ord(pos[0].lower()) - ord('a'), int(pos[1:])


    def _debug_print(self):
        for i in range(5):
            print(self.grid[i][:5])

    def set_value(self, location, value):
        i, j = self._convert_pos(location)
        self.grid[i][j] = value

    def get_value(self, location):
        i, j = self._convert_pos(location)
        # If numeric returns
        value = self.grid[i][j]
        try:
            return str(float(value))
        except ValueError:
            pass

        pieces = []
        temp = ""
        operands = ["+", "-", "/", "*"]

        for char in value:
            if char in operands:
                pieces.append(self.get_value(temp.strip()))
                pieces.append(char)
                temp = ""
            else:
                temp += char
        if temp:
            pieces.append(self.get_value(temp.strip()))
        return str(eval("".join(pieces)))

grid = Grid()
grid.set_value("a1", 10)
grid.set_value('b1', 15)
grid.set_value('c1', 'b1+a1')
grid.set_value('d1', 'c1+b1')
print(grid.get_value('d1'))