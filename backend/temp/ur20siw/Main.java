// Write your code here
import java.util.Scanner;

public class SumOfTwoNumbers {
    public static void main(String[] args) {
        // Create a Scanner object for getting user input
        Scanner scanner = new Scanner(System.in);
        
        // Prompt the user to enter the first number
        System.out.print("Enter the first number: ");
        double firstNumber = scanner.nextDouble();
        
        // Prompt the user to enter the second number
        System.out.print("Enter the second number: ");
        double secondNumber = scanner.nextDouble();
        
        // Calculate the sum of the two numbers
        double sum = firstNumber + secondNumber;
        
        // Display the result
        System.out.println("The sum of " + firstNumber + " and " + secondNumber + " is: " + sum);
        
        // Close the scanner
        scanner.close();
    }
}