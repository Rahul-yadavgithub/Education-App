import moment from 'moment';

// for the Email Validation we need to check the email validation

export const validateEmail = (email) =>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Now for the pasting the name or photo on the profile photo when we login the emil we need to use the function which extract the  1 and 2 letter form the word 

export const getInitials = (name) =>{
    if(!name){
        return ""; // If name is Empty then return normal we do not need to extract form the empty name
    }

    // Otherwise extract the 1 and and last name 1st letter we need to extract 

    let initials = "";

    const words = name.split(" ");

    for(let i = 0; i< Math.min(words.lenght, 2); i++){

        initials += words[i][0];
    }

    return initials.toUpperCase();
};

export const addThousandSeparator = (num) => {
    if(num == null || isNaN(num)){
        return "";  // means if number is not defiend and or the num is not a number so normally return the empty string
    }

    // otherwise conver the number into two part one is intger and other one into the fraction part if number contain fraction part then 

    const [integerPart, fractionalPart] =  num.toString().split("."); // means change the number into the string and then split the number where you encounter the "."

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger;
};


// The main purpose of prepareExpenseBarChartData is to transform raw expense data from the database into a simplified format that can be directly used in a bar char

export const prepareExpenseBarChartData = (data = [])=>{
    const chartData = data.map((item) =>({
        category : item?.category,
        amount : item?.amount,
    }))

    return chartData;
}

// [...data] creating a copy of the data  and sort the array on the basis of the custom funciton 
// (a, b) => new Date(a.date) - new Date(b.date) 

// a and b are two income objects from the array. -----> new Date(a.date) converts the string date to a JavaScript Date object.
export const prepareIncomeBarChartData = (data = []) =>{
    const sortData = [...data].sort(
        (a,b) => new Date(a.date)- new Date(b.date)
    );

    const chartData = sortData.map((item) =>({
        month : moment(item?.date).format("MMM"),
        amount : item?.amount,
        source : item?.source
    }));

    return chartData;
};


export const prepareExpenseLineChartData = (data = []) =>{
    const sortData = [...data].sort(
        (a,b) => new Date(a.date) - new Date(b.date)
    );

    const chartData = sortData.map((item) =>({
        month : moment(item?.date).format("MMM"),
        amount : item?.amount,
        category : item?.category,
    }));
    return chartData;
};



