# Function to check voting eligibility
def check_voting_eligibility(age):
    if age >= 18:
        return "You are eligible to vote!"
    else:
        return "Sorry, you are not eligible to vote yet."

# Main program
def main():
    print("Welcome to the Voting Eligibility Checker!")
    
    # Get user input
    age = input("Please enter your age: ")
    
    # Convert input to integer
    try:
        age = int(age)
    except ValueError:
        print("That's not a valid age. Please enter a number.")
        return
    
    # Check eligibility
    result = check_voting_eligibility(age)
    
    # Display the result
    print(result)

# Run the program
if __name__ == "__main__":
    main()