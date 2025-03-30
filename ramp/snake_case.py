# Your team is tasked with taking the source code sc from your coworker, and returning code with the all the names in snake case converted into lower camel case.
# More specifically:
# • Variable names may start with one or more underscores, and these should be preserved. For example
# _the_variable should become _theVariable
# • Variable names may end with trailing underscores, and these should be preserved. For example, the_variable. should become thevariable_
# • To keep the problem simple, you are not restricted to variable names, but instead should replace all instances of snake case


from calendar import c


test_input="""
def _dont_convert_this():
    _number = 10
    ___multiple = 100
    trailing__ = 10
    print("hello_sth")

@wrap_sth
def convert_this():
    number_two="sth"
    _=number_two
    print(number_two)
"""

def is_valid_char(char, start):
    if char == "_":
        return True
    if not start:
        return char.isalnum()
    return char.isalpha()

def convert(code):
    # tokenize the input by space/newline
    new_code = ""
    start = True
    n = len(code)
    i = 0
    seen_alphanum = False
    should_capitalize = False
    while i < n:
        char = code[i]
        if is_valid_char(char, start):
            if char == "_":
                if seen_alphanum:
                    should_capitalize=True
                new_code += char
            else:
                if should_capitalize:
                    new_code = new_code[:-1] + char.capitalize()
                    should_capitalize=False
                else:
                    new_code += char
                seen_alphanum=True
            start=False
        else:
            start=True
            should_capitalize=False
            seen_alphanum=False
            new_code += char
        i += 1
    return new_code

print(convert(test_input))


