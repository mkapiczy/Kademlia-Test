@set a=8000
@set b=%1 
set /a "c=%a%+%b%"
for /l %%x in (8000, 1, %c%) do start node index.js %%x
