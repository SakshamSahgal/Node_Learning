async function fun(parameter) 
{
    let ans = await new Promise((resolve, reject) => {

                let Judgement = [1,2,3]; 
                resolve(Judgement);
        })
		
    return ans;    
}