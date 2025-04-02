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
    __=more
    print(number_two)
"""


def convert(code):
    # tokenize the input by space/newline
    new_code = ""
    met_alnum_in_identifier=False
    should_capitalize=True
    running_underscore_count = 0
    for char in code:
        if char == "_":
            if met_alnum_in_identifier:
                should_capitalize=True
            else:
            # Prefix
                new_code += char
            running_underscore_count += 1
        elif char.isalnum():
            running_underscore_count = 0
            met_alnum_in_identifier=True
            new_code += char.upper() if should_capitalize else char
            should_capitalize=False
        else:
            # Suffix
            if should_capitalize:
                new_code += '_' * running_underscore_count

            met_alnum_in_identifier=False
            should_capitalize=False
            running_underscore_count = 0
            new_code += char

    return new_code

print(convert(test_input))


