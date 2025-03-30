# Assume identifier token can have alphanum + "_" character, but no starting numeric number

test_input = """
def _dont_convert_this():
    _number = 10
    ___multiple = 100
    trailing__ = 10
    __lead__ = 2
    print("hello_sth")

@wrap_sth
def convert_this():
    number_two="sth"
    _=number_two
    print(number_two)
"""


def convert_camel_case(word):
    n = len(word)
    leading = 0
    trailing = n

    for i in range(n):
        if word[i] == "_":
            leading += 1
        else:
            break

    for i in range(n - 1, leading, -1):
        if word[i] == "_":
            trailing -= 1
        else:
            break

    parts = word[leading:trailing].split("_")
    print(leading, word[:leading],  trailing, word[trailing:])
    return (
        word[:leading]
        + parts[0].lower()
        + "".join([part.capitalize() for part in parts[1:]])
        + word[trailing:]
    )


def convert(code):
    identifier = False
    word = ""
    new_code = ""

    for char in code:
        if char == "_" or char.isalpha() or (identifier and char.isnumeric()):
            word += char
            identifier = True
        else:
            identifier = False
            new_code += convert_camel_case(word)
            word = ""
            new_code += char
    return new_code

print(convert(test_input))
