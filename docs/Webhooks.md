# Webhooks

Baqio peut notifier automatiquement un service tiers en envoyant un appel POST vers une URL définie à chaque fois qu’un des événements ci-dessous se produit.

Le contenu du POST sera : 

- un attribut “topic” avec le type d’événement (exemple customer.updated)
- un attribut data avec le contenu de l’objet en question (exemple customer)

Liste des événements (topic) qui sont envoyés : 

**Clients (customer)**

- customer.created
- customer.updated
- customer.deleted

**Commande (order)**

- order.validated
- order.unvalidated
- order.details_updated
- invoice.created
- receipt.created
- order.update_paid_amount
- order.cancelled
- order_line.created
- order_line.updated
- shipping_line.updated
- commission_line.updated

**Expédition (fulfillment)**
- picking_requested: Préparation demandée
- picking_started: Préparation commencée
- picking_completed: Préparation terminée
- picking_cancelled: Annulation de la demande de préparation


**Produit (product)**

- product.created
- product.updated
- product.deleted

**Millésime (product_vintage)**

- product_vintage.created
- product_vintage.updated
- product_vintage.deleted

**Variante produit (product_variant)**

- product_variant.created
- product_variant.updated
- product_variant.deleted

**Tarif produit (product_price)**

- product_price.created
- product_price.updated
- product_price.deleted