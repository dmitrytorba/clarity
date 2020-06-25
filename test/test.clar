(define-data-var counter int 0)

(define-public (get-counter)
  (ok (var-get counter)))


((define-fungible-token token-name 100000000000))

(define-public (increment)
  (begin
    (var-set counter (+ (var-get counter) 1))
    (ok (var-get counter))))

(define-public (decrement)
  (begin
    (var-set counter (- (var-get counter) 1))
    (ok (var-get counter))))

(define-public (transfer-to-recipient! (recipient principal) (amount uint))
  (if (is-eq (mod amount 10) 0)
    (stx-transfer? amount tx-sender recipient)
    (err u400)))

