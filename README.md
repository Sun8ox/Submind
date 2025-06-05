# Submind
Subscription model webová aplikácia.   
Postavená na Next.js, Backend by sa dal v budúcnosti prerobiť aj na nejakú inú platformu len keďže semak toho backendu moc nieje a ja mám najviac skúsenosti práve s ním, Next.js mi príde ako najjednoduchšia voľba.  

## Hosting  
Vercel

## Storage  
~~Vercel blob storage~~  
Cloudflare R2 (S3 compatible API)

## Database  
Neon serverless db

## Mail
Resend

## Aktuálna production adresa:  
https://submind.sun8ox.me  
  
# API Structure    
## Authentifikácia
- /api/auth
    - /login -> Prihlásenie    
    - /register -> Registrácia  
    - /verify -> Verifikácia účtu  
    - /logout -> Odhlásenie   
    - /changePassword -> Zmena hesla  

## Použivatelia
- /api/users
    - /get
        - /public -> Získanie "public" informácii (bez potreby tokenu)  
        - /user -> Získanie informácii iba pre daného uživateľa (potrebný token)

## Videá  
- /api/videos
    - /addComment -> nedokončené  
    - /like -> nedokončené
    - /edit/[videoId] -> Úprava informácii o videu  
    - /get/[videoId] -> Získanie informácii o videu (potrebný token)  
    - /home -> Získanie videí na homepage takže   všetky public videa ku ktorým má daný uživateľ prístup  
    - /remove/[videoId] -> Odstránenie videa (potrebný token)  
    - /reupload -> Reupload videa v storage (potrebný token)  
    - /upload -> Upload a pridanie videa  
    - /view/[videoId] -> Generovanie presigned URL adresy na zobrazenie videa  