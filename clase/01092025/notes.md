# preguntits


## link to a specific section

https://stackoverflow.com/questions/8424785/link-to-a-section-of-a-webpage

## ID vs class in CSS

## create two columns


https://www.w3schools.com/howto/howto_css_two_columns.asp


## hovering mouse
https://www.google.com/search?q=mouse+hover+css&rlz=1C1UUXU_esCL1062CL1062&oq=mouse+hover+css&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDM5OTdqMGoxqAIAsAIA&sourceid=chrome&ie=UTF-8

## input type password

<input type="password" id="password" name="password">

## hashing a pass

```
    const bcrypt = require('bcryptjs');

    async function hashPassword(plainTextPassword) {
        const saltRounds = 10; // Recommended salt rounds for production
        const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        return hashedPassword;
    }
```
