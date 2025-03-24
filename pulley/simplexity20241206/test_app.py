import unittest
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Ell
import ell
ell.init()

# Import necessary functions
from app import run_assistant_conversation
from ell import user

class TestAnswerQuestion(unittest.TestCase):

    def test_answer_question(self):
        # Run the assistant conversation
        answer = run_assistant_conversation("Tell me about the latest scientific discoveries")

        # Print the answer
        print(answer)

if __name__ == '__main__':
    unittest.main() 