CREATE PROCEDURE FI_SP_LimpaBenefi
    @IdCliente bigint
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Beneficiarios
    WHERE IDCLIENTE = @IdCliente;
END