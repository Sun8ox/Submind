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

# Povinné environment variables  
DATABASE_URL (string) - Adresa postgres databázy, najlepšie Neon (neviem či iné fungujú)  
  
OBJECT_STORAGE_ENDPOINT (string) - HTTP adresa S3 compatible object storage (ja používam Cloudflare R2)  
 
OBJECT_STORAGE_ACCESS_KEY_ID (string) - Authentifikácia na S3 compatible object storage  
 
OBJECT_STORAGE_SECRET_ACCESS_KEY (string) - Authentifikácia na S3 compatible object storage  
 
OBJECT_STORAGE_BUCKET_NAME (string) - Názov bucketu na S3 compatible object storage  

JWT_SECRET (string) - JWT private key  
  
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
    - /settings -> Získanie a upravenie nastavení (nedokončené)

## Videá  
- /api/videos
    - /addComment -> Pridávanie komentárov (nedokončené)  
    - /like -> Likovanie videa (nedokončené)
    - /edit/[videoId] -> Úprava informácii o videu  
    - /get/[videoId] -> Získanie informácii o videu (potrebný token)  
    - /home -> Získanie videí na homepage takže   všetky public videa ku ktorým má daný uživateľ prístup  
    - /remove/[videoId] -> Odstránenie videa (potrebný token)  
    - /reupload -> Reupload videa v storage (potrebný token)  
    - /upload -> Upload a pridanie videa  
    - /view/[videoId] -> Generovanie presigned URL adresy na zobrazenie videa  

### Common API response  
- JSON formát
- common properties:
    - success: boolean -> označuje či sa podarilo úspešne vykonať úlohu
    - message: string -> obsahuje správu ktorú daný endpoint alebo funkcia v ňom vracia. Môžu byť priamo implementované do UI ako error/success messages

